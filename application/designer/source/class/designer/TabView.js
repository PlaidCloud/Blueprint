/* ************************************************************************

Tartan Blueprint Designer

    http://www.tartansolutions.com

    Copyright:
      2008 - 2009 Tartan Solutions, Inc

    License:
      LGPL: http://www.gnu.org/licenses/lgpl.html
      EPL: http://www.eclipse.org/org/documents/epl-v10.php
      See the LICENSE file in the project's top-level directory for details.

    Authors:
      * Dan Hummon

************************************************************************ */

qx.Class.define("designer.TabView",
{
	extend  : qx.ui.tabview.TabView,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(barPosition)
	{
		this.base(arguments, barPosition);
		
		var designPage = new qx.ui.tabview.Page("Design View");
		var sourcePage = new qx.ui.tabview.Page("Source View");
		var scriptPage = new qx.ui.tabview.Page("Script Editor");
		var functionPage = new qx.ui.tabview.Page("Function Editor");
		var dataPage = new qx.ui.tabview.Page("Data Editor");
		var controllerPage = new qx.ui.tabview.Page("Data Controllers");
		var bindingPage = new qx.ui.tabview.Page("Data Binding Editor");
		
		this.set({
		    "designPage": designPage,
		    "sourcePage": sourcePage,
		    "scriptPage": scriptPage,
		    "functionPage": functionPage,
		    "dataPage": dataPage,
		    "controllerPage": controllerPage,
		    "bindingPage": bindingPage
		});
		
		this.add(designPage);
		this.add(sourcePage);
		this.add(scriptPage);
		this.add(functionPage);
		this.add(dataPage);
		this.add(controllerPage);
		this.add(bindingPage);
		
		bindingPage.setLayout(new qx.ui.layout.Canvas());
		//var testBool = new designer.selector.Boolean();
		//bindingPage.add(testBool);
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
	    objectTree :
		{
			check: "designer.tree.Tree"
		},
		
	    designPage :
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    designArea :
	    {
	        check : "qx.ui.container.Composite"
	    },
	    
	    sourcePage :
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    scriptPage :
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    functionPage : 
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    dataPage:
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    controllerPage:
	    {
	        check : "qx.ui.tabview.Page"
	    },
	    
	    bindingPage:
	    {
	        check : "qx.ui.tabview.Page"
	    }
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
	    setupDesignPage : function()
	    {
	        var page = this.getDesignPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var designArea = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	        
	        this.setDesignArea(designArea);
	        
	        page.add(designArea, {left: 0, top: 0, right: 0, bottom: 0});
	    },
	    
	    setupSourcePage : function()
	    {
	        var page = this.getSourcePage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var exportArea = new designer.controller.Source();
	        exportArea.setFont("monospace");
            exportArea.setValue("");
            
            page.add(exportArea, {left: 0, top: 0, right: 0, bottom: 0});
            
            page.addListener("appear", function(e) {
                this.getObjectTree().exportJson();
            }, this);
            
            page.addListener("disappear", function(e) {
                try {
                    if (exportArea.getValue() != "" && exportArea.getValue() != exportArea.getLastKnownGood()){
                        this.getObjectTree().importJson(qx.util.Json.parse(exportArea.getValue()));
                    }
                } catch(e) {
                    alert('Json Parsing Failed: ' + e);
                    this.getObjectTree().importJson(qx.util.Json.parse(exportArea.getLastKnownGood()));
                }
            }, this);
            
            return exportArea;
	    },
	    
	    setupScriptPage : function(objectTree)
	    {
	        var page = this.getScriptPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var scriptController = new designer.controller.Script(objectTree);
	        
            page.add(scriptController, {left: 0, top: 0, right: 0, bottom: 0});
	    },
	    
	    setupFunctionPage : function(objectTree)
	    {
	        var page = this.getFunctionPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var functionController = new designer.controller.Function(objectTree);
	        
            page.add(functionController, {left: 0, top: 0, right: 0, bottom: 0});
	    },
	    
	    setupDataPage : function(objectTree)
	    {
	        var page = this.getDataPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var dataController = new designer.controller.Data(objectTree);
	        
            page.add(dataController, {left: 0, top: 0, right: 0, bottom: 0});
	    }
	},

	/*
	*****************************************************************************
	DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{

	}
});