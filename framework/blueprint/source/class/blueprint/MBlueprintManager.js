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
            this.setObjectId(vData.objectId);
            blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this);
        }

        // Set the object type and if this object is a container, generate the contents.
        if (vData != undefined) {
            if (!skipRecursion && vData.contents != undefined && vData.contents.length > 0 && typeof this.add == 'function') {
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
                var sourceObj = blueprint.util.Registry.getInstance().get(this, vData.bindings[b].sourceId);
                var targetObj = blueprint.util.Registry.getInstance().get(this, vData.bindings[b].targetId);
                var options = new Object();

                if (vData.bindings[b].converter != undefined) {
                    var functionText = blueprint.util.Misc.replaceVariables(this, vData.bindings[b].converter);
                    
                    try {
                        var convertfunction = null;
                        eval('convertfunction = ' + functionText);
                        options["converter"] = convertfunction;
                    } catch (e) {
                        alert("converter function " + vData.bindings[b].converter + " failed to initialize with the error: " + e.message);
                    }
                    
                }

                this.debug(sourceObj + ".bind("+obj.sourceProperty+", "+targetObj+", "+obj.targetProperty+")");
                sourceObj.bind(obj.sourceProperty, targetObj, obj.targetProperty, options);
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
        if (typeof this.postMixinConstruct == 'function') {
            this.postMixinConstruct(vData, namespace, skipRecursion);
        }

        // Store any functions that need to be run for an object after the entire form is created.
        if (typeof this.postContainerConstruct == 'function') {
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
