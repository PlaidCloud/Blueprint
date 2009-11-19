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
            if (context == undefined) { context = "general"; }
            if (typeof blueprintObj.getBlueprintNamespace == "function") {
                if (this.__registry[blueprintObj.getBlueprintNamespace()] == undefined ||
                    this.__registry[blueprintObj.getBlueprintNamespace()][context] == undefined ||
                    this.__registry[blueprintObj.getBlueprintNamespace()][context][variable] == undefined) {
                    return false;
                } else {
                    return true;
                }
            } else {
                this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot check " + variable);
            }
        },

        get : function(blueprintObj, variable, context) {
            if (context == undefined) { context = "general"; }
            if (typeof blueprintObj.getBlueprintNamespace == "function") {
                return this.__registry[blueprintObj.getBlueprintNamespace()][context][variable];
            } else {
                this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + variable);
            }
        },

        getByNamespace : function(namespace, variable, context) {
            if (context == undefined) { context = "general"; }
            return this.__registry[namespace][context][variable];
        },

        getContext : function(blueprintObj, context) {
            if (typeof blueprintObj.getBlueprintNamespace == "function") {
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
            if (context == undefined) { context = "general"; }
            delete this.__registry[namespace];
        }
    }
});