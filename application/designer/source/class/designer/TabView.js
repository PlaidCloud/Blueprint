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
		
		this.set({"designPage": designPage, "sourcePage": sourcePage, "scriptPage": scriptPage, "functionPage": functionPage});
		
		this.add(designPage);
		this.add(sourcePage);
		this.add(scriptPage);
		this.add(functionPage);
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
            
            return exportArea;
	    },
	    
	    setupScriptPage : function(objectTree)
	    {
	        var page = this.getScriptPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
	        
	        var scriptController = new designer.controller.Script(objectTree);
	        
            page.add(scriptController, {left: 0, top: 0, right: 0, bottom: 0});
	    },
	    
	    setupFunctionPage : function()
	    {
	        var page = this.getFunctionPage();
	        
	        page.setLayout(new qx.ui.layout.Canvas());
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