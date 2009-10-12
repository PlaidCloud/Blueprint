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

qx.Class.define("designer.toolbar.ToolBar",
{
	extend  : qx.ui.toolbar.ToolBar,

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
		this.base(arguments);
		
		this.setObjectTree(objectTree);
		
		var file_menu = new qx.ui.menu.Menu();
		
		var new_file_menu = new qx.ui.menu.Menu();
		
		this._newFormCommand = new qx.event.Command("Ctrl+F");
		this._newFormCommand.addListener("execute", this.newForm, this);
		
		this._newWindowCommand = new qx.event.Command("Ctrl+N");
		this._newWindowCommand.addListener("execute", this.newWindow, this);
		
		this._closeCommand = new qx.event.Command("Ctrl+W");
		this._closeCommand.addListener("execute", this.close, this);
		
		this._exportJsonCommand = new qx.event.Command("Ctrl+X");
		this._exportJsonCommand.addListener("execute", this.exportJson, this);
		
		this._importJsonCommand = new qx.event.Command("Ctrl+I");
		this._importJsonCommand.addListener("execute", this.importJson, this);
		
		var new_file_button = new qx.ui.menu.Button("New", null, null, new_file_menu);
		var open_file_button = new qx.ui.menu.Button("Open", null, null);
		var save_file_button = new qx.ui.menu.Button("Save", null, null);
		var close_file_button = new qx.ui.menu.Button("Close", null, this._closeCommand);
		var export_file_button = new qx.ui.menu.Button("Export", null, this._exportJsonCommand);
		var import_file_button = new qx.ui.menu.Button("Import", null, this._importJsonCommand);
		
		var new_form_button = new qx.ui.menu.Button("Form", null, this._newFormCommand);
		var new_window_button = new qx.ui.menu.Button("Window", null, this._newWindowCommand);
		
		var file_toolbar_button = new qx.ui.toolbar.MenuButton("File", null, file_menu);
		
		new_file_menu.add(new_form_button);
		new_file_menu.add(new_window_button);
		
		file_menu.add(new_file_button);
		file_menu.add(open_file_button);
		file_menu.add(save_file_button);
		file_menu.add(close_file_button);
		file_menu.add(export_file_button);
		file_menu.add(import_file_button);
		
		this.add(file_toolbar_button);
		
		this.add(new qx.ui.toolbar.Separator());
		
		var export_button = new qx.ui.toolbar.Button("Export to Playground");
		this.add(export_button);
		export_button.addListener("click", this.getObjectTree().exportToPlayground, this.getObjectTree());
		
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
		
		topDock :
		{
			check: "qx.core.Object"
		}
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		close : function(e)
		{	
			this.getObjectTree().setActiveForm(null);
		},
		
		newForm : function(e)
		{
			var layoutObj = {
				"qxSettings": {
					"decorator": "backgroundGrid"
				},
				"constructorSettings": {
					"innerLayout": "qx.ui.layout.Canvas"
				}
			};
			
			this.getObjectTree().setActiveForm(new designer.widget.Simple(new blueprint.ui.container.Composite(layoutObj, "new_form")));
		},
		
		newWindow : function(e)
		{
			alert('New window!' + e);
		},
		
		exportJson : function(e)
		{
			this.getObjectTree().exportJson();
		},
		
		importJson : function(e)
		{
			alert('Export JSON!' + e);
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