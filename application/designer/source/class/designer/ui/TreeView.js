/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Adams Tower
*/

/** TODOC
 */
qx.Class.define("designer.ui.TreeView", {
    extend: qx.ui.tree.VirtualTree,

    /** TODOC
     */
    construct: function() {
        var r = {"genId": "Json not loaded yet.", "objId": "", "objClass": ""};
        var tree = qx.data.marshal.Json.createModel(r, true);
        this.base(arguments, tree, "atomLabel", "children");
        
        this.setOpenMode("none");
        this.setDelegate(this._delegate);
        this.setItemHeight(30);
        
        var that = this;
        qx.core.Init.getApplication().getManager().addListener("jsonLoaded", function(e) {
            var r = that._buildtree(qx.core.Init.getApplication().getManager().getRootObject());
            var tree = qx.data.marshal.Json.createModel(r, true);
            that.setModel(tree);
        });
    },

    properties: {
    },

    members: {
        _buildtree: function(genId) {
            var childrenIds = qx.core.Init.getApplication().getManager().getObjectContents(genId);
            var children = [];
            var manager = qx.core.Init.getApplication().getManager();
            
            for (var i=0; i<childrenIds.length; i++) {
                children.push(this._buildtree(childrenIds[i]));
            }
            
            var className = manager.getObjectClass(genId);
            var clazz = manager.getClass(className);
            var objectId = manager.getObjectId(genId);
            
			var atomLabel = objectId;
			if (atomLabel) { atomLabel += " "; }
			atomLabel += "(" + className.split('.').pop() + ")";
			
			var atomIcon = "";
			if (clazz && clazz.icon) {
				atomIcon = clazz.icon;
			}
			
            if (children.length > 0) {
                return {
                	"atomLabel": atomLabel,
                	"atomIcon": atomIcon,
                    "genId": genId,
                    "objId": objectId,
                    "objClass": className, 
                    "children": children,
                    "securityVisibility": "excluded",
                    "securityBin": ""
                };
            } else {
                return {
	                "atomLabel": atomLabel,
	                "atomIcon": atomIcon,
                    "genId": genId,
                    "objId": objectId,
                    "objClass": className,
                    "securityVisibility": "visible",
                    "securityBin": manager.getObjectSecurityBin(genId)
                };
            }
        },
        
        _delegate: {
            bindItem: function(controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("atomLabel", "atomLabel", null, item, id);
                controller.bindProperty("atomIcon", "atomIcon", null, item, id);
                controller.bindProperty("genId", "generatedId", null, item, id);
                controller.bindProperty("objId", "objectId", null, item, id);
                controller.bindProperty("objClass", "objectClass", null, item, id);
                controller.bindProperty("securityVisibility", "securityVisibility", null, item, id);
                controller.bindProperty("securityBin", "securityBin", null, item, id);
            },
        
            createItem: function() {
                return new designer.ui.TreeViewItem();
            }
        }
    }
});
