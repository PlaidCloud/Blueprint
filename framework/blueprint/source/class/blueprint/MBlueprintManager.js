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
        if (vData != undefined && vData.type != undefined) {
            this.setBlueprintType(vData.objectClass);
            if (vData.type == "container" || vData.type == "top_container" || vData.type == "application_container") {
                if (!skipRecursion && vData.contents != undefined) {
                    for (var i=0;i<vData.contents.length;i++) {
                        this.add(blueprint.Manager.getInstance().generate(vData.contents[i].object, this, namespace), vData.contents[i].layoutmap);
                    }
                }
            }
        }

        // Run top_container scripts and initialize functions
        if (vData != undefined && vData.type == "top_container") {

            // After all objects have been created, set up data bindings.
            // First set up the data elements:

            for (var v in vData.blueprintData.data) {
                if (typeof vData.blueprintData.data[v] == 'object') {
                    if (vData.blueprintData.data[v] instanceof Array) {
                        var dataObject = new qx.data.Array(vData.blueprintData.data[v]);
                    } else if (vData.blueprintData.data[v] instanceof Object) {
                        // Special blueprint data objects
                        if (vData.blueprintData.data[v].objectClass != undefined) {
                            var dataObject = blueprint.Manager.getInstance().generate(vData.blueprintData.data[v], this, namespace);
                        }
                    }
                    
                    // Object or Array data type
                    this.debug('object or array found!');
                } else {
                    // Simple data type
                    this.debug('Simple datatype found: ' + typeof vData.blueprintData.data[v]);
                    var dataObject = new blueprint.data.Object(vData.blueprintData.data[v]);
                    this.debug(namespace + ', ' + v + ', ' + dataObject);
                }
                if (dataObject != undefined) {
                    blueprint.util.Registry.getInstance().set(namespace, v, dataObject);
                }
            }

            // Set up any controllers:
            if (vData.blueprintData.controllers == undefined) { vData.blueprintData.controllers = new Object(); }
            for (var c=0;c<vData.blueprintData.controllers.length;c++) {
                blueprint.Manager.getInstance().generate(vData.blueprintData.controllers[c], this, namespace);
            }

            // Set up any binding elements:

            if (vData.blueprintData.bindings == undefined) { vData.blueprintData.bindings = new Object(); }
            for (var b=0;b<vData.blueprintData.bindings.length;b++) {
                var obj = vData.blueprintData.bindings[b];
                var sourceObj = blueprint.util.Registry.getInstance().get(this, vData.blueprintData.bindings[b].sourceId);
                var targetObj = blueprint.util.Registry.getInstance().get(this, vData.blueprintData.bindings[b].targetId);
                var options = new Object();

                if (vData.blueprintData.bindings[b].converter != undefined) {
                    var functionText = blueprint.util.Misc.replaceVariables(this, vData.blueprintData.bindings[b].converter);
                    
                    try {
                        eval('var convertfunction = ' + functionText);
                        options["converter"] = convertfunction;
                    } catch (e) {
                        alert("converter function " + vData.blueprintData.bindings[b].converter + " failed to initialize with the error: " + e.message);
                    }
                    
                }

                this.debug(sourceObj + ".bind("+obj.sourceProperty+", "+targetObj+", "+obj.targetProperty+")");
                sourceObj.bind(obj.sourceProperty, targetObj, obj.targetProperty, options);
            }

            // Run all scripts
            for (var scriptName in vData.blueprintScripts) {
                // Perform variable name replacement

                // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
                var scriptText = blueprint.util.Misc.replaceVariables(this, vData.blueprintScripts[scriptName]);

                // Execute script
                try {
                    eval(scriptText);
                } catch (e) {
                    alert("blueprintScript " + scriptName + " failed with the error: " + e.message);
                }
            }

            // Initialize all functions
            for (var functionName in vData.blueprintFunctions) {
                // Perform variable name replacement

                // matches is an array of strings that begin with a $ and are followed by a letter or underscore.
                var functionText = blueprint.util.Misc.replaceVariables(this, vData.blueprintFunctions[functionName]);

                // Apply function
                try {
                    eval('this.blueprintFunction_' + functionName + ' = ' + functionText);
                } catch (e) {
                    alert("blueprintFunction " + functionName + " failed to initialize with the error: " + e.message);
                }
            }
        }

        // Check for and run any post-mixin constructors.
        if (typeof this.postMixinConstruct == 'function') {
            this.postMixinConstruct(vData, namespace, skipRecursion);
        }

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

        blueprintType :
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
