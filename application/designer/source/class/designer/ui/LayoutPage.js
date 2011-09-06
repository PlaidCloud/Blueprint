qx.Class.define("designer.ui.LayoutPage",
{
	extend : qx.ui.tabview.Page,
	
	construct : function() {
		this.base(arguments, "Layout");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: "north"});
		
		var toolbarButton = new qx.ui.toolbar.Button("I'm a button that does nothing and my name is waaaaaaaay too long!");
		toolbar.add(toolbarButton);
		
		var typeMenuButton = new designer.ui.TypeMenuButton();
		toolbar.add(typeMenuButton);
		
		var outerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(outerContainer, {edge: "center"});
		
		var pane = new qx.ui.splitpane.Pane("horizontal");
		
		this._paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
			minWidth : 150,
			width : 300,
			decorator : "main"
		});
		
		this._leftTabView = new qx.ui.tabview.TabView("top");
		this._leftTabView.setContentPadding(3, 3, 3, 3);
		this._editorPage = new qx.ui.tabview.Page("Property Editor");
		this._editorPage.setLayout(new qx.ui.layout.Grow());
		//this._editorPage.setPadding(1, 1, 1, 1);
		this._treePage = new qx.ui.tabview.Page("Object Tree");
		this._treePage.setLayout(new qx.ui.layout.Grow());
		//this._treePage.setPadding(1, 1, 1, 1);
		this._propertyEditor = new designer.ui.PropertyEditor();
		this._treeView = new designer.ui.TreeView();

		this._editorPage.add(this._propertyEditor);
		this._treePage.add(this._treeView);
		this._leftTabView.add(this._editorPage);
		this._leftTabView.add(this._treePage);

		this._paneLeft.add(this._leftTabView);
		//this._paneLeft.add(this._treeView);
		//this._paneLeft.add(this._propertyEditor);
		
		this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
			decorator : "main"
		});
		
		this.__selectionPopup = new designer.ui.SelectionPopup();
		this.__selectionPopup.set({
			autoHide: false
		});
		
		designer.core.manager.Selection.getInstance().addListener("changeSelection", this.showSelectionPopup, this);
		this._paneRight.addListener("resize", designer.core.manager.Selection.getInstance().clearSelection);
		
		pane.add(this._paneLeft, 0);
		pane.add(this._paneRight, 1);
		outerContainer.add(pane);
	},
	
	members : {
		_paneLeft: null,
		_paneRight: null,
		_propertyEditor: null,
		_treeView: null,
		__selectionPopup : null,
		
		layoutAdd : function(child, options, target) {
		    this.debug("Adams, LayoutPage, Adding " + child.getGeneratedId() + " to layoutpage.");
			this._paneRight.add(child, options);
		},
		
		showSelectionPopup : function(e) {
			var selection = e.getData();
			
			if (selection !== null) {
				this.__selectionPopup.setTarget(selection);
				this.__selectionPopup.set({
					width: selection.getSizeHint().width,
					height: selection.getSizeHint().height
				});
				this.__selectionPopup.show();
			} else {
				this.__selectionPopup.hide();
			}
		}
	}
});
