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

qx.Class.define("blueprint.util.Registry", {
    extend : qx.core.Object,
    type : "singleton",

    construct : function()
    {
        this.__registry = new Object();
    },

    members :
    {
        __registry : null,

        check : function(blueprintObj, variable, context) {
            var ns, v;
            if (variable.split(":").length == 1) {
                if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
                    ns = blueprintObj.getBlueprintNamespace();
                    v = variable;
                } else {
                    this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot check " + variable);
                }
            } else {
                ns = variable.split(":")[0];
                v = variable.split(":")[1];
            }
            
            if (context == undefined) { context = "general"; }
            
            if (this.__registry[ns] == undefined ||
                this.__registry[ns][context] == undefined ||
                this.__registry[ns][context][v] == undefined) {
                return false;
            } else {
                return true;
            }
        },

        get : function(blueprintObj, variable, context) {
            if (context == undefined) { context = "general"; }
            if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
                var ns, v;
                if (variable.split(":").length == 1) {
                    ns = blueprintObj.getBlueprintNamespace();
                    v = variable;
                } else {
                    ns = variable.split(":")[0];
                    v = variable.split(":")[1];
                }
                
                return this.__registry[ns][context][v];
            } else {
                this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + variable);
            }
        },

        getByNamespace : function(namespace, variable, context) {
            if (context == undefined) { context = "general"; }
            return this.__registry[namespace][context][variable];
        },

        getContext : function(blueprintObj, context) {
            if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
                return this.__registry[blueprintObj.getBlueprintNamespace()][context];
            } else {
                this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + context);
            }
        },

        getContextByNamespace : function(namespace, context) {
            return this.__registry[namespace][context];
        },

        set : function(namespace, variable, object, context) {
            if (context == undefined) { context = "general"; }
            if (this.__registry[namespace] == undefined) {
                this.__registry[namespace] = new Object();
            }
            if (this.__registry[namespace][context] == undefined) {
                this.__registry[namespace][context] = new Object();
            }
            this.__registry[namespace][context][variable] = object;
        },

        registerFunction : function(namespace, functionName, functionVar) {
            this.__registry[namespace]["functions"][functionName] = functionVar;
        },

        getFunctionByNamespace : function(namespace, functionName) {
            return this.__registry[namespace]["functions"][functionName];
        },

        clear : function(namespace) {
            delete this.__registry[namespace];
        },
        
        clearAll : function(namespace) {
            this.__registry = new Object();
        }
    }
});