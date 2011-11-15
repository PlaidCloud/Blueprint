qx.Class.define("designer.ui.LayoutPage",
{
	extend : qx.ui.tabview.Page,
	
	construct : function() {
		this.base(arguments, "Layout");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: "north"});
		
		this._loadJsonWindow = qx.core.Init.getApplication().getOverride('open-dialog') || new designer.ui.LoadJsonWindow();

		this._loadJsonButton = new qx.ui.toolbar.Button("Load a Json Document.");
		this._loadJsonButton.addListener("execute", this.loadJson, this);
		toolbar.add(this._loadJsonButton);
		
		this._saveJsonButton = qx.core.Init.getApplication().getOverride('save-json-button') || new qx.ui.toolbar.Button("Save Json.");
		toolbar.add(this._saveJsonButton);
		
		this._typeMenuButton = new designer.ui.TypeMenuButton();
		toolbar.add(this._typeMenuButton);
		
		this._createDefaultButton = new qx.ui.toolbar.Button("Create Object with Default Stub.");
		this._createDefaultButton.addListener("click", this.createDefault, this);
		toolbar.add(this._createDefaultButton);
		
		this._createCustomWindow = new designer.ui.CreateCustomWindow();
		
		this._createCustomButton = new qx.ui.toolbar.Button("Create Object with Custom Stub.");
		this._createCustomButton.addListener("click", this.createCustom, this);
		toolbar.add(this._createCustomButton);
		
		this._deleteButton = new qx.ui.toolbar.Button("Delete Selected Object.");
		this._deleteButton.addListener("click", this.deleteSelection, this);
		toolbar.add(this._deleteButton);
		
		this._editContentsButton = new qx.ui.toolbar.Button("Edit Contents.");
		this._editContentsButton.addListener("click", this.editContents, this);
		toolbar.add(this._editContentsButton);
		
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
		
		this.addListener("appear", function(e) {
			if (this.getLayoutParent().getLayoutParent().getCurrentTab() == "json") {
				this.getLayoutParent().getLayoutParent().getJsonPage().update();
			}
			this.getLayoutParent().getLayoutParent().setCurrentTab("layout");
		});
	},
	
	members : {
		_paneLeft: null,
		_paneRight: null,
		_propertyEditor: null,
		_treeView: null,
		__selectionPopup : null,
		
		layoutAdd : function(child, options, target) {
			this._paneRight.add(child, options);
		},
		
		clearPage : function() {
			this._paneRight.removeAll();
		},
		
		showSelectionPopup : function(e) {
			var selection = e.getData();
			if (selection !== null) {
				this.__selectionPopup.setTarget(selection);
				
				this.__selectionPopup.set({
					width: selection.getSizeHint().width,
					height: selection.getSizeHint().height
				});
			} else {
				this.__selectionPopup.hide();
			}
		},
		
		loadJson : function(e) {
			this.debug("I should display a dialog to load a json now.");
			this._loadJsonWindow.show();
		},
		
		createDefault : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			var classname = this._typeMenuButton.getLabel();
			if (!selectionparent) {
				//TODO: replace with user visible error
				this.debug("Adams, no parent selected!");
				//maybe use topcontainer here in this case?
			} else if (!classname || classname == "Choose a type.") {
				//TODO: replace with user visible eror
				this.debug("Adams, no class selected!");
			} else {
				var selection = selectionparent.getGeneratedId();
				if(qx.core.Init.getApplication().getManager().getClass(classname).STUB) {
					var stub = qx.core.Init.getApplication().getManager().getClass(classname).STUB;
				} else {
					var stub = designer.util.Misc.simpleStub(classname);
				}
				//this.debug("Adams, Well, I should be adding a " + classname + " to " + selection + ", with the default stub:\n" + stub);
				qx.core.Init.getApplication().getManager().createLayoutObject(qx.lang.Json.parse(stub), selection);
			}
		},
		
		createCustom : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			var classname = this._typeMenuButton.getLabel();
			if (!selectionparent) {
				//TODO: replace with user visible error
				this.debug("Adams, no parent selected!");
				//maybe use topcontainer here in this case?
			} else if (!classname || classname == "Choose a type.") {
				//TODO: replace with user visible eror
				this.debug("Adams, no class selected!");
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
			if (!selectionparent) {
				//TODO: replace with user visible error
				this.debug("Adams, nothing selected!");
			} else {
				var selectionid = selectionparent.getGeneratedId();
				qx.core.Init.getApplication().getManager().deleteLayoutObject(selectionid);
			}
		},
		
		editContents : function(e) {
			var selectionparent = designer.core.manager.Selection.getInstance().getSelection();
			if (!selectionparent) {
				//TODO: replace with user visible error
				this.debug("Adams, nothing selected!");
			} else {
				//var selection = selectionparent.getGeneratedId();
				if (selectionparent.editContents) {
					selectionparent.editContents();
				} else {
					//TODO: replace with user visible error
					this.debug("Adams, that's not something that has editable contents!")
				}
			}
		}
	}
});
