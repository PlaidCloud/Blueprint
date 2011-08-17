qx.Class.define("designer.ui.LayoutPage",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Layout");
    this.setPadding(2);
    this.setLayout(new qx.ui.layout.Dock());
    
    var toolbar = new qx.ui.toolbar.ToolBar();
    this.add(toolbar, {edge: "north"});
    
    var toolbarButton = new qx.ui.toolbar.Button("Add Button");
    toolbar.add(toolbarButton);
    
    toolbarButton.addListener("execute", this.addButton);
    
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

	pane.add(this._paneLeft, 0);
	pane.add(this._paneRight, 1);
	outerContainer.add(pane);
	
	this.__thing1 = new designer.blueprint.ui.container.Composite({
            "constructorSettings": {
                "innerLayout": "qx.ui.layout.Canvas" 
            },
            "contents": [],
            "objectClass": "blueprint.ui.container.Composite",
            "objectId": "",
            "qxSettings": {
            	"backgroundColor": "red",
            	"width": 200,
            	"height": 200
            }
    }, "nothing");
    
    this.__thing1.addListener("click", function(e) {
    	designer.core.manager.Selection.getInstance().setSelection(this.__thing1);
    	e.stopPropagation();
    });
    
    this._paneRight.add(this.__thing1);
  },
  
  members : {
  	_paneLeft: null,
  	_paneRight: null,
  	
  	addButton : function() {
  	
		var thing2 = new designer.blueprint.ui.form.Button({
				"constructorSettings": {},
				"contents": [],
				"objectClass": "blueprint.ui.form.Button",
				"objectId": "",
				"qxSettings": {
					"label": "I'm a button!",
					"width": 100,
					"height": 20,
					"focusable": false
				}
		}, "nothing");
		
		this.__thing1.add(thing2);
		thing2.addListener("click", function(e) {
			designer.core.manager.Selection.getInstance().setSelection(thing2);
			e.stopPropagation();
		});
  	
  	}
  }
});