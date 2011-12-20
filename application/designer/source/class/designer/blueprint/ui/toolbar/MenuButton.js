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

qx.Class.define("designer.blueprint.ui.toolbar.MenuButton",
{
    extend: designer.placeholder.EditableBranch,
    members: {
        editContents: function() {
			if (!this._editWindow) {
				this._editWindow = new qx.ui.window.Window(this.getRepClassName() + "(" + this.getGeneratedId() + ")");
				this._editWindow.setLayout(new qx.ui.layout.Dock());
				var toolbar = new qx.ui.toolbar.ToolBar();
				this._editWindow.add(toolbar, {"edge":"north"});
				toolbar.add(new qx.ui.toolbar.Button("I do nothing"));
				
				this._buildTree();
			}

			qx.core.Init.getApplication().getManager().addListener("jsonLoaded", this._buildTree, this);

			this._editWindow.show();
        },

		_buildTree: function() {
			var hierarchy = this.getHierarchy();
			var nodes = qx.data.marshal.Json.createModel(hierarchy, true);
			if (this._tree) {
				this._editWindow.remove(this._tree);
			}
			this._tree = new qx.ui.tree.VirtualTree(nodes, "name", "children");
			this._editWindow.add(this._tree, {"edge": "center"});
		},

		getHierarchy: function(objId) {
			if (!objId) {
				objId = this.getGeneratedId();
			}
			var name = objId;
			var contents = qx.core.Init.getApplication().getManager().getObjectContents(objId);
			if (contents.length == 0) {
				return {"name": name};
			} else {
				var children = [];
				for (var i=0; i<contents.length; i++) {
					children.push(this.getHierarchy(contents[i]));
				}
				return {"name": name, "children": children};
			}
		}
    }
});
