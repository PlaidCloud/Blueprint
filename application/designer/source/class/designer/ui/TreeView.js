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
        this.debug("Adams, TreeView, in constructor.");
        //var r = this._buildtree(qx.core.Init.getApplication().getManager().getRootLayoutObject());
        //var r = {"genId": "objPretend", children: [{"genId": "objPretend1"}, {"genId": "objPretend2"}]};
        var r = {"genId": "Json not loaded yet."};
        var tree = qx.data.marshal.Json.createModel(r, true);
        this.base(arguments, tree, "genId", "children");
        
        //this.setSelectable(false);
        //this.setSelectionMode("none");
        this.setOpenMode("none");
        this.setDelegate(this._delegate);
        
        var that = this;
        qx.core.Init.getApplication().getManager().addListener("jsonLoaded", function(e) {
            that.debug("Adams, TreeView, loading");
            var r = that._buildtree(qx.core.Init.getApplication().getManager().getRootLayoutObject());
            var tree = qx.data.marshal.Json.createModel(r, true);
            that.setModel(tree);
        });
    },

    properties: {
    },

    members: {
        _buildtree: function(genId) {
            var childrenIds = qx.core.Init.getApplication().getManager().getObjectChildren(genId);
            var children = [];
            for (var i=0; i<childrenIds.length; i++) {
                children.push(this._buildtree(childrenIds[i]));
            }
            if (children.length > 0) {
                return {"genId": genId, "children": children};
            } else {
                return {"genId": genId};
            }
        },
        
        _delegate: {
            bindItem: function(controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("genId", "generatedId", null, item, id);            
            },
        
            createItem: function() {
                return new designer.ui.TreeViewItem();
            }
        }
    },

    destruct: function() {
    }
});
