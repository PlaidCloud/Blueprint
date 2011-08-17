qx.Class.define("designer.ui.LayoutPage",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Layout");
    this.setPadding(2);
    this.setLayout(new qx.ui.layout.Dock());
    
    var toolbar = new qx.ui.toolbar.ToolBar();
    this.add(toolbar, {edge: "north"});
    
    var toolbarButton = new qx.ui.toolbar.Button("Add Something");
    toolbar.add(toolbarButton);
    
    var outerContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow());
    this.add(outerContainer, {edge: "center"});
    
	var pane = new qx.ui.splitpane.Pane("horizontal");
	
	this._paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow).set({
		width : 200,
		decorator : "main"
	});
	
	this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
		decorator : "main"
	});

	pane.add(this._paneLeft, 0);
	pane.add(this._paneRight, 1);
	outerContainer.add(pane);
	
	var thing = new designer.blueprint.ui.container.Composite({
            "constructorSettings": {
                "innerLayout": "qx.ui.layout.Canvas" 
            },
            "contents": [],
            "objectClass": "blueprint.ui.container.Composite",
            "objectId": "",
            "qxSettings": {
            	"backgroundColor": "red"
            }
    });
    
    this._paneRight.add(thing);
  },
  
  members : {
  	_paneLeft: null,
  	_paneRight: null
  }
});