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

/**
* The top container object is always at the top level of a blueprint object.
* This object stores and processes all the top level infomation for an object including:
* <ul>
*  <li><code>data</code> The collection of data elements for a blueprint object.
*	This area is split into a <code>simple</code> and a <code>complex</code>
*	section. Simple data is simply meant to replicate basic json data values
*	into the runtime, where the complex data goes through the standard blueprint
*	object creation routines.</li>
*  <li><code>controllers</code> Controllers mirror the qooxdoo controllers object structure.
*		The general idea of controllers is connecting a view component to a set of data stored
*		in a model. The kind of controller you need depends on the view component. </li>
*  <li><code>bindings</code> Blueprint bindings mirror the qooxdoo single value binding
*		functionality. They allow you to keep a value automatically synchronized with another
*		over the runtime of your object, although they might be spatially separated and have
*		different visual representations (e.g. a text field and a spinner). Additionally,
*		you can provide a type conversion parameter if necessary.</li>
*  <li><code>events</code> Blueprint events are a way to link the qooxdoo event structure into
*		a blueprint object. By specifying a source id, event name, and event function, you can
*		define complex behavior inside of an object. For example, set the <code>execute</code>
*		event of a button to set the value of a textfield to an empty string.</li>
*  <li><code>functions</code> Blueprint functions allow you to write javascript code that
*		governs the object's behavior. The code is run on a context object with objectIds
*		assigned to each property of the blueprint object.</li>
* </ul>
*/
qx.Class.define("blueprint.TopContainer", {
	extend: qx.core.Object,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* Initiates the creation of a blueprint object.
	*
	* @param vData {Object}
	*	The JSON describing this object.
	* @param namespace {String}
	*	The string name used to globally identify all objectIDs within this object.
	* @param skipRecursion {Boolean}
	*	If true, none of this object's children be created.
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

		// Loop through all the blueprint events.
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
			var functionText = blueprint.util.Misc.replaceVariables(this, vData.functions[functionName].code.join("\n"));

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
		/**
		* The namespace for this object. All objectIds for this object can be
		* looked up via this value.
		*/
		blueprintNamespace: {
			check: "String",
			init: null,
			nullable: true
		},

		/**
		* This is a general purpose arguments object. Should probably be deprecated
		* all functionality implemented here moved into qxSetting properties with
		* transform/apply methods. Problems in constructorSettings often fail
		* silently and documentation is poor.
		*/
		constructorSettings: {
			check: "Object"
		},

		/**
		* The objectId for this object. Within a namespace, this identifier should
		* be unique to this object.
		*/
		objectId: {
			check: "String",
			init: "top_container"
		},

		/**
		* The user facing GUI elements for this object.
		*/
		layoutObject: {
			check: "Object"
		}
	},

	members: {
		__forceTypes: null,

		/**
		* This function will be used by a binding to invert the truthiness of a value.
		* @param data {var} The data to be modified for this listener.
		* @return {Boolean} Data value cast as a boolean and inverted.
		*/
		__inverterFunction: function(data) { return !Boolean(data); },

		/**
		* Cast a value assigned by a binding to a boolean.
		* @param data {var} The data to be modified for this listener.
		* @return {Boolean} Data value cast as a boolean.
		*/
		__forceBoolean: function(data) { return Boolean(data); },
		
		/**
		* Cast a value assigned by a binding to a string.
		* @param data {var} The data to be modified for this listener.
		* @return {String} Data value cast as a string.
		*/
		__forceString: function(data) { if (data) { return String(data); } else { return ""; } },
		
		/**
		* Cast a value assigned by a binding to a number.
		* @param data {var} The data to be modified for this listener.
		* @return {Number} Data value cast as a number.
		*/
		__forceNumber: function(data) { return Number(data); },

		/**
		* Cast a value assigned by a binding to an integer.
		* @param data {var} The data to be modified for this listener.
		* @return {Integer} Data value cast as an integer.
		*/
		__forceInt: function(data) { return parseInt(data, 10); },
		
		/**
		* Cast a value assigned by a binding to a float.
		* @param data {var} The data to be modified for this listener.
		* @return {Number} Data value cast as a float.
		*/
		__forceFloat: function(data) { return parseFloat(data); },
		
		/**
		* Cast a value assigned by a binding to a javascript date object.
		* @param data {var} The data to be modified for this listener.
		* @return {Date} Data value cast as a date.
		*/
		__forceDate: function(data) { if (data) { return new Date(data); } else { return null; } },

		/**
		* Cast a value assigned by a binding to a string, but allow null values.
		* @param data {var} The data to be modified for this listener.
		* @return {String||null} Data value cast as a string or null.
		*/
		__forceStringWithNulls: function(data) { if (data !== null && data !== undefined) { return String(data); } else { return null; } },
		
		/**
		* Cast a value assigned by a binding to a number, but allow null values.
		* @param data {var} The data to be modified for this listener.
		* @return {Number||null} Data value cast as a number or null.
		*/
		__forceNumberWithNulls: function(data) { if (data !== null && data !== undefined) { return Number(data); } else { return null; } },
		
		/**
		* Cast a value assigned by a binding to an integer, but allow null values.
		* @param data {var} The data to be modified for this listener.
		* @return {Integer||null} Data value cast as an integer or null.
		*/
		__forceIntWithNulls: function(data)    { if (data !== null && data !== undefined) { return parseInt(data, 10); } else { return null; } },
		
		/**
		* Cast a value assigned by a binding to a float, but allow null values.
		* @param data {var} The data to be modified for this listener.
		* @return {Number||null} Data value cast as a float or null.
		*/
		__forceFloatWithNulls: function(data)  { if (data !== null && data !== undefined) { return parseFloat(data); } else { return null; } },
		
		/**
		* Cast a value assigned by a binding to a javascript date object, but allow null values.
		* @param data {var} The data to be modified for this listener.
		* @return {Date||null} Data value cast as a date or null.
		*/
		__forceDateWithNulls: function(data)   { if (data !== null && data !== undefined) { return new Date(data); } else { return null; } }
	}
});
