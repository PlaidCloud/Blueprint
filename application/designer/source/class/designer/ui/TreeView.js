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
        this.base(arguments, tree, "genId", "children");
        
        this.setOpenMode("none");
        this.setDelegate(this._delegate);
        
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
            for (var i=0; i<childrenIds.length; i++) {
                children.push(this._buildtree(childrenIds[i]));
            }
            if (children.length > 0) {
                return {
                    "genId": genId,
                    "objId": qx.core.Init.getApplication().getManager().getObjectId(genId),
                    "objClass": qx.core.Init.getApplication().getManager().getObjectClass(genId), 
                    "children": children
                };
            } else {
                return {
                    "genId": genId,
                    "objId": qx.core.Init.getApplication().getManager().getObjectId(genId),
                    "objClass": qx.core.Init.getApplication().getManager().getObjectClass(genId)
                };
            }
        },
        
        _delegate: {
            bindItem: function(controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("genId", "generatedId", null, item, id);
                controller.bindProperty("objId", "objectId", null, item, id);
                controller.bindProperty("objClass", "objectClass", null, item, id);
            },
        
            createItem: function() {
                return new designer.ui.TreeViewItem();
            }
        }
    }
});
