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

qx.Class.define("designer.controller.Function",
{
	extend  : qx.ui.container.Composite,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(objectTree)
	{
		this.base(arguments, new qx.ui.layout.Dock());
		
		this.setObjectTree(objectTree);
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: 'north'});
		
		var newFunction = new qx.ui.toolbar.Button("New Function");
		var saveFunction = new qx.ui.toolbar.Button("Save Function");
		var delFunction = new qx.ui.toolbar.Button("Delete Function");
		
		toolbar.add(newFunction);
		toolbar.add(saveFunction);
		toolbar.add(delFunction);
		
		newFunction.addListener("execute", this.newFunction, this);
		saveFunction.addListener("execute", this.saveFunction, this);
		
		var splitPane = new qx.ui.splitpane.Pane("vertical");
		
		this.add(splitPane, {edge: "center"});
		
		var targetTop = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		var targetBot = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		
		splitPane.add(targetTop, 1);
		splitPane.add(targetBot, 1);
		
		var functionList = new qx.ui.form.List();
		var functionArea = new qx.ui.form.TextArea();
		
		functionList.setSelectionMode("single");
		functionArea.setEnabled(false);
		
		targetTop.add(functionList);
		targetBot.add(functionArea);
		
		this.setFunctionList(functionList);
		this.setFunctionArea(functionArea);
		
		this.addListener("appear", this.refreshFunctions, this);
		
		functionList.addListener("changeSelection", function(e) {
		    if (this.isSelectionEmpty()) {
		        functionArea.setEnabled(false);
		    } else {
		        functionArea.setEnabled(true);
		    }
		});
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
		
	    functionList :
	    {
	        check: "qx.ui.form.List"
	    },
	    
	    functionArea :
	    {
	        check: "qx.ui.form.TextArea"
	    }
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
	    refreshFunctions : function()
	    {
		    this.getFunctionList().removeAll();
		    this.getFunctionArea().setValue("");
		    
		    this.getFunctionArea().setEnabled(false);
		    
		    var functionsObject = this.getObjectTree().getBlueprintFunctions();
		    var rawFunctionsKeys = new Array();
		    for (var s in functionsObject) { rawFunctionsKeys.push(s); }
		    var functionsKeys = new qx.data.Array(rawFunctionsKeys);
		    
		    var functionController = new qx.data.controller.List(functionsKeys, this.getFunctionList());
		    
		    var options = {
		        converter: function(value) {
		            return functionsObject[value];
		        }
		    };
		    functionController.bind("selection[0]", this.getFunctionArea(), "value", options);
		},
	    
	    saveFunction : function()
	    {
	        if (this.getFunctionList().isSelectionEmpty()) {
	            alert('No function selected!');
	        } else {
	            alert('Saving function ' + this.getFunctionList().getValue() + ' as ' + this.getFunctionArea().getValue());
	            this.getObjectTree().saveBlueprintFunction(this.getFunctionList().getValue(), this.getFunctionArea().getValue());
	        }
	    },
	    
	    newFunction : function()
	    {
	        var name = prompt("Enter a name for this function");
	        
	        this.getObjectTree().saveBlueprintFunction(name, "");
	        
	        this.refreshFunctions();
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