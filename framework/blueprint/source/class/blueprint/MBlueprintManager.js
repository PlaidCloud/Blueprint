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
* Provides blueprintManager functionality to any widget.
*/
qx.Mixin.define("blueprint.MBlueprintManager",
{
    construct : function(vData, namespace, skipRecursion)
    {
        if (vData.constructorSettings != undefined) {
            this.setConstructorSettings(vData.constructorSettings);
        } else {
            this.setConstructorSettings(new Object());
        }

        if (namespace != undefined) { this.setBlueprintNamespace(namespace); }

        // Register this object in the namespace if it has a variable name.
        if (vData != undefined && vData.objectId != undefined && vData.objectId != '') {
            var validIds = vData.objectId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (validIds != null && validIds.length == 1 && validIds[0] == vData.objectId) {
                this.setObjectId(vData.objectId);
                blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this);
            } else {
                throw new Error("Invalid Object ID: (" + vData.objectId + ") -- ObjectIds must match the regex: [a-zA-Z_][a-zA-Z0-9_]*");
            }
        }

        // Set the object type and if this object is a container, generate the contents.
        if (vData != undefined) {
            if (!skipRecursion && vData.contents != undefined && vData.contents.length > 0 && qx.lang.Type.isFunction(this.add)) {
                for (var i=0;i<vData.contents.length;i++) {
                    this.add(blueprint.Manager.getInstance().generate(vData.contents[i].object, this, namespace), vData.contents[i].layoutmap);
                }
            }
        }

        // Run top_container scripts and initialize functions
        if (vData.type == "top_container") {

            // After all objects have been created, set up data bindings.
            // First set up the data elements:
            // Simple data objects are set up first:
            
            if (vData.data.simple == undefined) { vData.data.simple = new Array(); }
            for (var d in vData.data.simple) {
                if (vData.data.simple[d] instanceof Array) {
                    // Data array
                    var dataObject = new qx.data.Array(vData.data.simple[d]);
                } else {
                    // Simple data type
                    var dataObject = new blueprint.data.Object(vData.data.simple[d]);
                }
                if (dataObject != undefined) {
                    // Register the data object by it's name
                    blueprint.util.Registry.getInstance().set(namespace, d, dataObject);
                }
            }
            
            // Blueprint data objects are created here:
            if (vData.data.complex == undefined) { vData.data.complex = new Array(); }
            for (var d=0;d<vData.data.complex.length;d++) {
                if (vData.data.complex[d].objectClass != undefined && vData.data.complex[d].objectId != undefined) {
                    blueprint.Manager.getInstance().generate(vData.data.complex[d], this, namespace);
                }
            }

            // Set up any controllers:
            if (vData.controllers == undefined) { vData.controllers = new Array(); }
            for (var c=0;c<vData.controllers.length;c++) {
                blueprint.Manager.getInstance().generate(vData.controllers[c], this, namespace);
            }

            // Set up any binding elements:

            if (vData.bindings == undefined) { vData.bindings = new Array(); }
            for (var b=0;b<vData.bindings.length;b++) {
                var obj = vData.bindings[b];
                var sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);
                var targetObj = blueprint.util.Registry.getInstance().get(this, obj.targetId);
                var options = new Object();

                if (obj.converter != undefined) {
                    var functionText = blueprint.util.Misc.replaceVariables(this, obj.converter);
                    
                    try {
                        var convertfunction = null;
                        eval('convertfunction = ' + functionText);
                        options["converter"] = convertfunction;
                    } catch (e) {
                        alert("converter function " + obj.converter + " failed to initialize with the error: " + e.message);
                    }
                }

                this.debug(sourceObj + ".bind("+obj.sourceProperty+", "+targetObj+", "+obj.targetProperty+")");
                sourceObj.bind(obj.sourceProperty, targetObj, obj.targetProperty, options);
            }
            
            // Loop through all the event to function bindings.
            if (vData.events == undefined) { vData.events = new Array(); }
            for (var e=0;e<vData.events.length;e++) {
                var obj = vData.events[e];
                var sourceObj = blueprint.util.Registry.getInstance().get(this, obj.sourceId);
                var args = obj.eventArgs;
                var functionObj, functionName;
                
                // If the eventFunct property is an array, it should be formatted as ["objectId", "functionName"]
                if (qx.lang.Type.isArray(obj.eventFunct)) {
                    functionObj = blueprint.util.Registry.getInstance().get(this, obj.eventFunct[0]);
                    functionName = obj.eventFunct[1];
                }
                
                // Loop through the arguments array to check for blueprint objects.
                // Blueprint objects will be defined in the eventArgs array as an object with property: "objectId"
                for (var a=0;a<args.length;a++) {
                    if (qx.lang.Type.isObject(args[a]) && qx.lang.Object.getLength(args[a]) == 1 && blueprint.util.Registry.getInstance().check(this, args[a]["objectId"])) {
                        args[a] = blueprint.util.Registry.getInstance().get(this, args[a]["objectId"]);
                    }
                }
                
                if (obj.fireOnce == true) {
                    sourceObj.addListenerOnce(obj.eventName, blueprint.util.Misc.buildListener(functionObj, functionName, args));
                } else {
                    sourceObj.addListener(obj.eventName, blueprint.util.Misc.buildListener(functionObj, functionName, args));
                }
                
            }

            // Run all scripts
            for (var scriptName in vData.scripts) {
                // Perform variable name replacement

                // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
                var scriptText = blueprint.util.Misc.replaceVariables(this, vData.scripts[scriptName]);

                // Execute script
                try {
                    eval(scriptText);
                } catch (e) {
                    alert("blueprintScript " + scriptName + " failed with the error: " + e.message);
                }
            }

            // Initialize all functions
            for (var functionName in vData.functions) {
                // Perform variable name replacement

                // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
                var functionText = blueprint.util.Misc.replaceVariables(this, vData.functions[functionName]);

                // Apply function
                try {
                    var newFunction = null;
                    eval('newFunction = ' + functionText);
                    blueprint.util.Registry.getInstance().set(namespace, functionName, newFunction);
                } catch (e) {
                    alert("blueprintFunction " + functionName + " failed to initialize with the error: " + e.message);
                }
            }
        }

        // Check for and run any post-mixin constructors.
        if (qx.lang.Type.isFunction(this.postMixinConstruct)) {
            this.postMixinConstruct(vData, namespace, skipRecursion);
        }

        // Store any functions that need to be run for an object after the entire form is created.
        if (qx.lang.Type.isFunction(this.postContainerConstruct)) {
            if (blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__') == false && 
            blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__args__') == false) {
                blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', new Array());
                blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', new Array());
            }
            blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__').push(this.postContainerConstruct);
            blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__').push(new Array(vData, namespace, skipRecursion, this));
        }
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        blueprintNamespace :
        {
            check : "String",
            init : null,
            nullable : true
        },

        constructorSettings :
        {
            check: "Object"
        },

        objectId :
        {
            check: "String",
            init: ""
        }
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {

    },

    /*
    *****************************************************************************
    DESTRUCTOR
    *****************************************************************************
    */

    destruct : function() {

    }
});
