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
    *   The JSON object describing this widget.
    */
    construct: function(vData, namespace, skipRecursion) {
        this.base(arguments);

        this.set(vData.qxSettings);
        if (vData.constructorSettings) {
            this.setConstructorSettings(vData.constructorSettings);
        } else {
            this.setConstructorSettings(new Object());
        }

        qx.core.Assert.assertString(namespace, "A namespace must be provided.");
        this.setBlueprintNamespace(namespace);

        // Create the post container constructor and args arrays.
        blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', new Array());
        blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', new Array());

        // SHOULD GENERATE LAYOUT OBJECTS HERE!!
        this.setLayoutObject(blueprint.Manager.getInstance().generate(vData.layout, this, namespace));

        // Run top_container scripts and initialize functions
        // After all layout objects have been created, set up data bindings.
        // First set up the data elements:
        // Simple data objects are set up first:
        if (vData.data.simple === undefined) {
            vData.data.simple = new Array();
        }
        for (var d in vData.data.simple) {
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
            vData.data.complex = new Array();
        }
        for (var d = 0; d < vData.data.complex.length; d++) {
            if (qx.lang.Type.isString(vData.data.complex[d].objectClass) && qx.lang.Type.isString(vData.data.complex[d].objectId)) {
                blueprint.Manager.getInstance().generate(vData.data.complex[d], this, namespace);
            }
        }

        // Set up any controllers:
        if (vData.controllers === undefined) {
            vData.controllers = new Array();
        }
        for (var c = 0; c < vData.controllers.length; c++) {
            blueprint.Manager.getInstance().generate(vData.controllers[c], this, namespace);
        }

        // Set up any binding elements:
        if (vData.bindings === undefined) {
            vData.bindings = new Array();
        }
        for (var b = 0; b < vData.bindings.length; b++) {
            var obj = vData.bindings[b];
            var sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);
            var targetObj = blueprint.util.Registry.getInstance().get(this, obj.targetId);
            var options = new Object();

            if (obj.converter) {
                var functionText = blueprint.util.Misc.replaceVariables(this, obj.converter);

                try {
                    var convertfunction = null;
                    eval('convertfunction = ' + functionText);
                    options["converter"] = convertfunction;
                } catch(e) {
                    this.warn("converter function " + obj.converter + " failed to initialize with the error: " + e.message);
                }
            }

            this.debug(sourceObj + ".bind(" + obj.sourceProperty + ", " + targetObj + ", " + obj.targetProperty + ")");
            sourceObj.bind(obj.sourceProperty, targetObj, obj.targetProperty, options);
        }

        // Loop through all the event to function bindings.
        if (vData.events === undefined) {
            vData.events = new Array();
        }
        for (var e = 0; e < vData.events.length; e++) {
            var obj = vData.events[e];
            var sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);

            if (obj.fireOnce == true) {
                sourceObj.addListenerOnce(obj.eventName, blueprint.util.Misc.buildListener(obj.eventFunct, namespace), this);
            } else {
                sourceObj.addListener(obj.eventName, blueprint.util.Misc.buildListener(obj.eventFunct, namespace), this);
            }
        }

        // Run all scripts
        if (vData.scripts === undefined) {
            vData.scripts = new Object();
        }
        for (var scriptName in vData.scripts) {
            // Perform variable name replacement
            // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
            var scriptText = blueprint.util.Misc.replaceVariables(this, vData.scripts[scriptName]);

            // Execute script
            try {
                eval(scriptText);
            } catch(e) {
                this.warn("blueprintScript " + scriptName + " failed with the error: " + e.message);
            }
        }

        // Initialize all functions
        if (vData.functions === undefined) {
            vData.functions = new Object();
        }
        for (var functionName in vData.functions) {
            // Perform variable name replacement
            // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
            var functionText = blueprint.util.Misc.replaceVariables(this, vData.functions[functionName]);

            // Apply function
            try {
                var newFunction = null;
                eval('newFunction = ' + functionText);
                blueprint.util.Registry.getInstance().set(namespace, functionName, newFunction);
            } catch(e) {
                this.warn("blueprintFunction " + functionName + " failed to initialize with the error: " + e.message);
            }
        }

        // Add a pointer in the registry so any blueprint element in a namespace can find the top_container.
        blueprint.util.Registry.getInstance().set(namespace, "top_container", this, "top_container");

        // Check for namespace functions that need to be run after object creation.
        if (blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__') && blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__args__')) {
            var constructors = blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__');
            var args = blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__');
            for (var k = 0; k < constructors.length; k++) {
                constructors[k](args[k][0], args[k][1], args[k][2], args[k][3]);
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
            check: "qx.ui.core.LayoutItem"
        }
    }
});
