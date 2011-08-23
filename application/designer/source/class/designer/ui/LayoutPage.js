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
		
		var outerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(outerContainer, {edge: "center"});
		
		var pane = new qx.ui.splitpane.Pane("horizontal");
		
		this._paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
			minWidth : 150,
			width : 200,
			decorator : "main"
		});
		
		this._propertyEditor = new designer.ui.PropertyEditor();
		this._treeView = new designer.ui.TreeView();
		this._paneLeft.add(this._treeView);
		//this._paneLeft.add(this._propertyEditor);
		
		this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
			decorator : "main"
		});
		
		this.__selectionPopup = new designer.ui.SelectionPopup();
		this.__selectionPopup.set({
			autoHide: false
		});
		designer.core.manager.Selection.getInstance().addListener("changeSelection", this.showSelectionPopup, this);
		
		this.addListener("resize", function(e) {
			
		}, this);
		
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
		
		add : function(child, options, target) {
			switch(target) {
				case "paneLeft":
				this._paneLeft.add(child, options);
				break;
				
				case "paneRight":
				this._paneRight.add(child, options);
				break;
				
				default:
				this.base(arguments, child, options);
				break;
			}
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
		}
	}
});
