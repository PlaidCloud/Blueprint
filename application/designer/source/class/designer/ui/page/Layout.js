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

qx.Class.define("designer.ui.page.Layout",
{
	extend : designer.ui.page.Abstract,
	
	construct : function() {
		this.base(arguments, "Layout");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());

		var palette = new designer.ui.Palette();

		this.add(palette, {edge: "north"});
		
		//var toolbar = new qx.ui.toolbar.ToolBar();
		//this.add(toolbar, {edge: "north"});
				
		//this._typeMenuButton = new designer.ui.TypeMenuButton();
		//toolbar.add(this._typeMenuButton);
				
		var outerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(outerContainer, {edge: "center"});

		var outerpane = new qx.ui.splitpane.Pane("horizontal");

		//var _paneLeftLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow);

		var pane = new qx.ui.splitpane.Pane("horizontal");
		
		this._paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
			minWidth : 150,
			width : 300,
			decorator : "main"
		});

		this._paneRightRight = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
			minWidth : 150,
			width: 300,
			decorator : "main"
		});
		
		this._leftTabView = new qx.ui.tabview.TabView("top");
		this._leftTabView.setContentPadding(3, 3, 3, 3);
		this._editorPage = new qx.ui.tabview.Page("Property Editor");
		this._editorPage.setLayout(new qx.ui.layout.Grow());
		this._treePage = new qx.ui.tabview.Page("Object Tree");
		this._treePage.setLayout(new qx.ui.layout.Grow());
		this._propertyEditor = new designer.ui.PropertyEditor();
		this._treeView = new designer.ui.TreeView();

		this._editorPage.add(this._propertyEditor);
		this._treePage.add(this._treeView);
		this._leftTabView.add(this._editorPage);
		this._leftTabView.add(this._treePage);

		this._paneLeft.add(this._leftTabView);
		
		this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
			decorator : new qx.ui.decoration.Background().set ({
				backgroundImage: "designer/Checker-soft.png",
				backgroundRepeat: "repeat"
			})
		});
		this._paneRight.addListener("mousedown", designer.core.manager.Selection.getInstance().clearSelection);
		
		var selectionPopup = new designer.ui.SelectionPopup();
		selectionPopup.set({
			autoHide: false
		});
		
		designer.core.manager.Selection.getInstance().setPopup(selectionPopup);
		
		this._paneRight.addListener("resize", designer.core.manager.Selection.getInstance().clearSelection);

		//this._paneRightRight.add(new qx.ui.basic.Label("Palette goes here"));
		
		pane.add(this._paneLeft, 0);
		pane.add(this._paneRight, 1);
		//_paneLeftLeft.add(pane);
		//outerpane.add(_paneLeftLeft, 0);
		//outerpane.add(this._paneRightRight, 1);
		//pane.add(this._paneRightRight, 2);
		outerContainer.add(pane);
		//outerContainer.add(outerpane);
	},
	
	members : {
		_paneLeft: null,
		_paneRight: null,
		_propertyEditor: null,
		_treeView: null,
		
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
				if(qx.core.Init.getApplication().getManager().getClass(classname).STUB) {
					var stub = qx.core.Init.getApplication().getManager().getClass(classname).STUB;
				} else {
					var stub = designer.util.Misc.simpleStub(classname);
				}
				qx.core.Init.getApplication().getManager().createLayoutObject(qx.lang.Json.parse(stub), selection);
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
				qx.core.Init.getApplication().getManager().deleteLayoutObject(selectionid);
			}
		},
		
		editContents : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			if (!selectionparent) {
				designer.util.Misc.plaidAlert("Can't edit contents, nothing selected.");
			} else {
				if (qx.core.Init.getApplication().getEditContents(selectionparent)) {
					qx.core.Init.getApplication().getEditContents(selectionparent).call();
				} else if (qx.lang.Type.isFunction(selectionparent.editContents)) {
					selectionparent.editContents();
				} else {
					designer.util.Misc.plaidAlert("That's not something that has editable contents.");
				}
			}
		}
	}
});