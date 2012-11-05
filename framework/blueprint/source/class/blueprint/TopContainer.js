/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2009 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

qx.Class.define("blueprint.TopContainer", {
	extend: qx.core.Object,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*	The JSON object describing this widget.
	*/
	construct: function(vData, namespace, skipRecursion) {
		this.base(arguments);

		this.__forceTypes = {
			"boolean": this.__forceBoolean,
			"string": this.__forceString,
			"number": this.__forceNumber,
			"int": this.__forceInt,
			"float": this.__forceFloat,
			"date": this.__forceDate,
			"stringWithNulls": this.__forceStringWithNulls,
			"numberWithNulls": this.__forceNumberWithNulls,
			"intWithNulls": this.__forceIntWithNulls,
			"floatWithNulls": this.__forceFloatWithNulls,
			"dateWithNulls": this.__forceDateWithNulls
		};

		this.set(vData.qxSettings);
		if (vData.constructorSettings) {
			this.setConstructorSettings(vData.constructorSettings);
		} else {
			this.setConstructorSettings({});
		}

		qx.core.Assert.assertString(namespace, "A namespace must be provided.");
		this.setBlueprintNamespace(namespace);

		// Create the post container constructor and args arrays.
		blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', []);
		blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', []);

		// Generate the layout objects.
		this.setLayoutObject(blueprint.Manager.getInstance().generate(vData.layout, this, namespace));

		// After all layout objects have been created, set up data bindings.
		// First set up the data elements:
		// Simple data objects are set up first:
		var d, obj, sourceObj, targetObj;

		if (vData.data.simple === undefined) {
			vData.data.simple = [];
		}
		for (d in vData.data.simple) {
			var dataObject;
			if (vData.data.simple[d] instanceof Array) {
				// Data array
				dataObject = new qx.data.Array(vData.data.simple[d]);
			} else {
				// Simple data type
				dataObject = new blueprint.data.Object(vData.data.simple[d]);
			}
			if (dataObject !== null) {
				// Register the data object by it's name
				blueprint.util.Registry.getInstance().set(namespace, d, dataObject);
			}
		}

		// Blueprint data objects are created here:
		if (vData.data.complex === undefined) {
			vData.data.complex = [];
		}
		for (d = 0; d < vData.data.complex.length; d++) {
			if (qx.lang.Type.isString(vData.data.complex[d].objectClass) && qx.lang.Type.isString(vData.data.complex[d].objectId)) {
				blueprint.Manager.getInstance().generate(vData.data.complex[d], this, namespace);
			}
		}

		// Set up any controllers:
		if (vData.controllers === undefined) {
			vData.controllers = [];
		}
		for (var c = 0; c < vData.controllers.length; c++) {
			blueprint.Manager.getInstance().generate(vData.controllers[c], this, namespace);
		}

		// Set up any binding elements:
		if (vData.bindings === undefined) {
			vData.bindings = [];
		}
		for (var b = 0; b < vData.bindings.length; b++) {
			obj = vData.bindings[b];
			sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);
			targetObj = blueprint.util.Registry.getInstance().get(this, obj.targetId);
			var options = {};

			qx.core.Assert.assertUndefined(obj.converter, "Binding converter functions have been deprecated; please use a blueprint function instead.");

			if (obj.inverter) {
				options["converter"] = this.__inverterFunction;
			}

			if (obj.forceType) {
				qx.core.Assert.assertFunction(this.__forceTypes[obj.forceType], "This type is not recognized.");
				options["converter"] = this.__forceTypes[obj.forceType];
			}

			sourceObj.bind(obj.sourceProperty, targetObj, obj.targetProperty, options);
		}

		// Loop through all the event to function bindings.
		if (vData.events === undefined) {
			vData.events = [];
		}
		for (var e = 0; e < vData.events.length; e++) {
			obj = vData.events[e];
			sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);

			if (obj.fireOnce === true) {
				sourceObj.addListenerOnce(obj.eventName, blueprint.util.Misc.buildListener(obj.eventFunct, namespace), this);
			} else {
				sourceObj.addListener(obj.eventName, blueprint.util.Misc.buildListener(obj.eventFunct, namespace), this);
			}
		}

		// Initialize all functions
		var initFunction = null;
		if (vData.functions === undefined) {
			vData.functions = {};
		}
		for (var functionName in vData.functions) {
			qx.core.Assert.assertObject(vData.functions[functionName], "Malformed function object!");
			qx.core.Assert.assertArray(vData.functions[functionName].code, "Malformed function object; code array not found!");
			qx.core.Assert.assertArray(vData.functions[functionName].args, "Malformed function object; args array not found!");
			// Perform variable name replacement
			// matches is an array of strings that begin with a $ and are followed by a letter or underscore.
			var functionText = blueprint.util.Misc.replaceVariables(this, vData.functions[functionName].code.join(""));

			// Apply function
			try {
				var newFunction = new Function(vData.functions[functionName].args, functionText);
				blueprint.util.Registry.getInstance().registerFunction(namespace, functionName, newFunction);
				if (functionName == "init") { initFunction = newFunction; }
			} catch(e) {
				this.warn("blueprintFunction " + functionName + " failed to initialize with the error: " + e.message);
			}
		}
		
		// Run the init function if it exists.
		if (initFunction) {
			try {
				initFunction.apply(blueprint.util.Registry.getInstance().getContextByNamespace(namespace), [namespace]);
			} catch(e) {
				this.warn("blueprintFunction " + functionName + " failed to run with the error: " + e.message);
			}
		}

		// Add a pointer in the registry so any blueprint element in a namespace can find the top_container.
		blueprint.util.Registry.getInstance().set(namespace, "top_container", this, "top_container");

		// Check for namespace functions that need to be run after object creation.
		if (blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__') && blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__args__')) {
			var constructors = blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__');
			var args = blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__');
			for (var k = 0; k < constructors.length; k++) {
				constructors[k].apply(args[k][3], args[k]);
			}

			blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', null);
			blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', null);
		}
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties: {
		blueprintNamespace: {
			check: "String",
			init: null,
			nullable: true
		},

		constructorSettings: {
			check: "Object"
		},

		objectId: {
			check: "String",
			init: "top_container"
		},

		layoutObject: {
			check: "Object"
		}
	},

	members: {
		__forceTypes: null,

		__inverterFunction: function(data, model, source, target) { return !Boolean(data); },
		__forceBoolean: function(data, model, source, target) { return Boolean(data); },
		__forceString: function(data, model, source, target) { if (data) { return String(data); } else { return ""; } },
		__forceNumber: function(data, model, source, target) { return Number(data); },
		__forceInt: function(data, model, source, target) { return parseInt(data, 10); },
		__forceFloat: function(data, model, source, target) { return parseFloat(data); },
		__forceDate: function(data, model, source, target) { if (data) { return new Date(data); } else { return null; } },

		__forceStringWithNulls: function(data, model, source, target) { if (data !== null && data !== undefined) { return String(data); } else { return null; } },
		__forceNumberWithNulls: function(data, model, source, target) { if (data !== null && data !== undefined) { return Number(data); } else { return null; } },
		__forceIntWithNulls: function(data, model, source, target)    { if (data !== null && data !== undefined) { return parseInt(data, 10); } else { return null; } },
		__forceFloatWithNulls: function(data, model, source, target)  { if (data !== null && data !== undefined) { return parseFloat(data); } else { return null; } },
		__forceDateWithNulls: function(data, model, source, target)   { if (data !== null && data !== undefined) { return new Date(data); } else { return null; } }
	}
});
