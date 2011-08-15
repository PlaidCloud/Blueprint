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

qx.Class.define("designer.controller.Script",
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
		
		var newScript = new qx.ui.toolbar.Button("New Script");
		var saveScript = new qx.ui.toolbar.Button("Save Script");
		var delScript = new qx.ui.toolbar.Button("Delete Script");
		
		toolbar.add(newScript);
		toolbar.add(saveScript);
		toolbar.add(delScript);
		
		newScript.addListener("execute", this.newScript, this);
		saveScript.addListener("execute", this.saveScript, this);
		
		var splitPane = new qx.ui.splitpane.Pane("vertical");
		
		this.add(splitPane, {edge: "center"});
		
		var targetTop = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		var targetBot = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		
		splitPane.add(targetTop, 1);
		splitPane.add(targetBot, 1);
		
		var scriptList = new qx.ui.form.List();
		var scriptArea = new qx.ui.form.TextArea();
		
		scriptList.setSelectionMode("single");
		scriptArea.setEnabled(false);
		
		targetTop.add(scriptList);
		targetBot.add(scriptArea);
		
		this.setScriptList(scriptList);
		this.setScriptArea(scriptArea);
		
		this.addListener("appear", this.refreshScripts, this);
		
		scriptList.addListener("changeSelection", function(e) {
		    if (this.isSelectionEmpty()) {
		        scriptArea.setEnabled(false);
		    } else {
		        scriptArea.setEnabled(true);
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
		
	    scriptList :
	    {
	        check: "qx.ui.form.List"
	    },
	    
	    scriptArea :
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
	    refreshScripts : function()
	    {
		    this.getScriptList().removeAll();
		    this.getScriptArea().setValue("");
		    
		    this.getScriptArea().setEnabled(false);
		    
		    var scriptsObject = this.getObjectTree().getBlueprintScripts();
		    var rawScriptsKeys = new Array();
		    for (var s in scriptsObject) { rawScriptsKeys.push(s); }
		    var scriptsKeys = new qx.data.Array(rawScriptsKeys);
		    
		    var scriptController = new qx.data.controller.List(scriptsKeys, this.getScriptList());
		    
		    var options = {
		        converter: function(value) {
		            return scriptsObject[value];
		        }
		    };
		    scriptController.bind("selection[0]", this.getScriptArea(), "value", options);
		},
	    
	    saveScript : function()
	    {
	        if (this.getScriptList().isSelectionEmpty()) {
	            alert('No script selected!');
	        } else {
	            alert('Saving script ' + this.getScriptList().getValue() + ' as ' + this.getScriptArea().getValue());
	            this.getObjectTree().saveBlueprintScript(this.getScriptList().getValue(), this.getScriptArea().getValue());
	        }
	    },
	    
	    newScript : function()
	    {
	        var name = prompt("Enter a name for this script");
	        
	        this.getObjectTree().saveBlueprintScript(name, "");
	        
	        this.refreshScripts();
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