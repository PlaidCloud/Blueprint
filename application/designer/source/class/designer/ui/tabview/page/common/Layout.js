/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon
*/

qx.Class.define("designer.ui.tabview.page.common.Layout",
{
	extend : designer.ui.tabview.page.Abstract,
	type: "abstract",
	
	construct: function(label, icon) {
		this.base(arguments, label, icon);
		this.__manager = qx.core.Init.getApplication().getManager();
		
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());

		var palette = new designer.ui.Palette();
				
		var outerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(outerContainer, {edge: "center"});

		var outerpane = new qx.ui.splitpane.Pane("horizontal");
		var pane = new qx.ui.splitpane.Pane("horizontal");
		
		this._paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
			minWidth : 150,
			width : 300,
			decorator : "main"
		});
		
		this._leftTabView = new qx.ui.tabview.TabView("top");
		this._leftTabView.setContentPadding(3, 3, 3, 3);
		this._editorPage = new qx.ui.tabview.Page("Property Editor", "fugue/icons/property-blue.png");
		this._editorPage.setLayout(new qx.ui.layout.VBox());
		this._treePage = new qx.ui.tabview.Page("Object Tree", "fugue/icons/node.png");
		this._treePage.setLayout(new qx.ui.layout.Grow());
		this._propertyEditor = new designer.ui.PropertyEditor();
		this._treeView = new designer.ui.TreeView();

		this._layoutController = new designer.ui.LayoutController();
		this._editorPage.add(this._propertyEditor, {flex: 1});
		this._editorPage.add(this._layoutController);
		
		this._treePage.add(this._treeView);
		this._leftTabView.add(this._editorPage);
		this._leftTabView.add(this._treePage);

		this._paneLeft.add(this._leftTabView);
		
		this._containerRight = new qx.ui.container.Composite(new qx.ui.layout.Dock());
		this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
			decorator : new qx.ui.decoration.Background().set ({
				backgroundImage: "designer/Checker-soft.png",
				backgroundRepeat: "repeat"
			})
		});
		this._paneRight.addListener("mousedown", designer.core.manager.Selection.getInstance().clearSelection);
		
		this._containerRight.add(palette, {edge: "north"});
		this._containerRight.add(this._paneRight, {edge: "center"});
		
		var selectionPopup = new designer.ui.SelectionPopup();
		
		designer.core.manager.Selection.getInstance().setPopup(selectionPopup);
		
		//this._paneRight.addListener("resize", designer.core.manager.Selection.getInstance().clearSelection);
		
		pane.add(this._paneLeft, 0);
		pane.add(this._containerRight, 1);
		
		outerContainer.add(pane);
	},
	
	members : {
		_paneLeft: null,
		_paneRight: null,
		_propertyEditor: null,
		_treeView: null,
		_layoutController: null,
		__manager: null,
		
		layoutAdd : function(child, options, target) {
			this._paneRight.add(child, options);
		},
		
		clearPage : function() {
			this._paneRight.removeAll();
		},
		
		createDefault : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			var classname = this._typeMenuButton.getLabel();
			if (!selectionparent) {
				designer.util.Misc.plaidAlert("Can't create object, no parent selected.");
			} else if (!classname || classname == "Choose a type.") {
				designer.util.Misc.plaidAlert("Can't create object, no class selected.");
			} else {
				var selection = selectionparent.getGeneratedId();
				if(this.__manager.getClass(classname).stub) {
					var stub = this.__manager.getClass(classname).stub;
				} else {
					var stub = designer.util.Misc.simpleStub(classname);
				}
				this.__manager.createLayoutObject(qx.lang.Json.parse(stub), selection);
			}
		},
		
		createCustom : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			var classname = this._typeMenuButton.getLabel();
			if (!selectionparent) {
				designer.util.Misc.plaidAlert("Can't create object, no parent selected.");
			} else if (!classname || classname == "Choose a type.") {
				designer.util.Misc.plaidAlert("Can't create object, no class selected.");
			} else {
				var selection = selectionparent.getGeneratedId();
				this._createCustomWindow.setSelection(selection);
				this._createCustomWindow.setClassname(classname);
				designer.core.manager.Selection.getInstance().setSelection(null);
				this._createCustomWindow.show();
			}
		},
		
		deleteSelection : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			designer.core.manager.Selection.getInstance().clearSelection();
			
			if (!selectionparent) {
				designer.util.Misc.plaidAlert("Can't delete, nothing selected.");
			} else {
				var selectionid = selectionparent.getGeneratedId();
				this.__manager.deleteLayoutObject(selectionid);
			}
		},
		
		editContents : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			if (!selectionparent) {
				designer.util.Misc.plaidAlert("Can't edit contents, nothing selected.");
			} else {
				if (qx.core.Init.getApplication().getEditContents(selectionparent)) {
					qx.core.Init.getApplication().getEditContents(selectionparent).call();
				} else {
					designer.util.Misc.plaidAlert("That's not something that has editable contents.");
				}
			}
		}
	}
});
