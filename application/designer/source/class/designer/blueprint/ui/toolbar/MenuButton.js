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
				this._editWindow = new designer.ui.window.Window(this.getRepClassName() + "(" + this.getGeneratedId() + ")");
				this._editWindow.setLayout(new qx.ui.layout.Dock());
				var toolbar = new qx.ui.toolbar.ToolBar();
				this._editWindow.add(toolbar, {"edge":"north"});
				var newButtonButton = new qx.ui.toolbar.Button("New Button");
				newButtonButton.addListener("execute", this.createButton, this);
				var newSeparatorButton = new qx.ui.toolbar.Button("New Separator");
				newSeparatorButton.addListener("execute", this.createSeparator, this);
				var newDynamicMenuButton = new qx.ui.toolbar.Button("New Dynamic Menu (does nothing)");
				toolbar.add(newButtonButton);
				toolbar.add(newSeparatorButton);
				toolbar.add(newDynamicMenuButton);
				
				this._buildTree();
			}

			qx.core.Init.getApplication().getManager().addListener("jsonLoaded", this._buildTree, this);

			this._editWindow.show();
        },

		createSeparator: function() {
			this.createThing("blueprint.ui.menu.Separator");
		},

		createButton: function() {
			this.createThing("blueprint.ui.menu.Button");
		},

		createThing: function(classname) {
			if (this._tree.getSelection().length == 0) {
				var parentId = this.getGeneratedId();
			} else {
				var parentId = this._tree.getSelection().getItem(0).getGenId();
			}
			if(qx.core.Init.getApplication().getManager().getClass(classname).stub) {
				var stub = qx.core.Init.getApplication().getManager().getClass(classname).stub;
			} else {
				var stub = designer.util.Misc.simpleStub(classname);
			}
			qx.core.Init.getApplication().getManager().createLayoutObject(qx.lang.Json.parse(stub), parentId);
		},

		_buildTree: function() {
			var hierarchy = this.getHierarchy();
			var nodes = qx.data.marshal.Json.createModel(hierarchy, true);
			if (this._tree) {
				this._editWindow.remove(this._tree);
			}
			this._tree = new qx.ui.tree.VirtualTree(nodes, "name", "children").set({delegate: new designer.ui.menu.MenuDelegate()});
			this._editWindow.add(this._tree, {"edge": "center"});
		},

		getHierarchy: function(objId) {
			if (!objId) {
				objId = this.getGeneratedId();
			}
			var name = qx.core.Init.getApplication().getManager().getObjectClass(objId) + "(" + objId + ")";
			var contents = qx.core.Init.getApplication().getManager().getObjectContents(objId);
			if (contents.length == 0) {
				return {"name": name, "genId": objId};
			} else {
				var children = [];
				for (var i=0; i<contents.length; i++) {
					children.push(this.getHierarchy(contents[i]));
				}
				children.push({"name": "", "genId": contents[contents.length-1]});
				return {"name": name, "genId": objId, "children": children};
			}
		}
    }
});
