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
		
		check : function(blueprintObj, variable) {
		    if (typeof blueprintObj.getBlueprintNamespace == "function") {
                if (this.__registry[blueprintObj.getBlueprintNamespace()] == undefined || this.__registry[blueprintObj.getBlueprintNamespace()] == null || this.__registry[blueprintObj.getBlueprintNamespace()][variable] == undefined || this.__registry[blueprintObj.getBlueprintNamespace()][variable] == null) {
                    return false;
                } else {
                    return true;
			    }
			} else {
			    this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot check " + variable);
			}
		},
		
		get : function(blueprintObj, variable) {
            if (typeof blueprintObj.getBlueprintNamespace == "function") {
                return this.__registry[blueprintObj.getBlueprintNamespace()][variable];
            } else {
                this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + variable);
                this.warn("::: " + qx.util.Json.stringify(blueprintObj));
            }
		},
		
		getByNamespace : function(namespace, variable) {
			return this.__registry[namespace][variable];
		},
		
		set : function(namespace, variable, object) {
			if (this.__registry[namespace] == undefined) {
				this.__registry[namespace] = new Object();
			}
			this.__registry[namespace][variable] = object;
		},
		
		clear : function(namespace) {
			this.__registry[namespace] = null;
		}
	}
});