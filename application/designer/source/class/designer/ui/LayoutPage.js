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
	
	this._paneRight = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
		decorator : "main"
	});
	
	var selectionHighlight = new qx.ui.container.Composite(new qx.ui.layout.Dock());
	
	selectionHighlight.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "north"});
	selectionHighlight.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "east"});
	selectionHighlight.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "south"});
	selectionHighlight.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "west"});
	selectionHighlight.add(new qx.ui.core.Widget().set({height: 50, width: 50}), {edge: "center"});
	selectionHighlight.set({opacity: 0.5});
	
	this._paneRight.add(selectionHighlight);

	pane.add(this._paneLeft, 0);
	pane.add(this._paneRight, 1);
	outerContainer.add(pane);
  },
  
  members : {
  	_paneLeft: null,
  	_paneRight: null,
  	
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
  	}
  }
});