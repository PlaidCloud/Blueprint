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

qx.Class.define("designer.controller.FormSecurity",
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
	construct : function(tree)
	{
		this.base(arguments, new qx.ui.layout.Canvas());
		
		this.set({
			width: 250,
			height: 320,
			objectTree: tree
		});
		
		var list_mode = new qx.ui.form.List();
		list_mode.add(new qx.ui.form.ListItem("myMode1"));
		list_mode.add(new qx.ui.form.ListItem("myMode2"));
		list_mode.add(new qx.ui.form.ListItem("myMode3"));
		
		this.add(new qx.ui.basic.Label("Security Modes:"), {top: 10, left: 10});
		this.add(list_mode, {top: 40, left: 10});
		
		this.enableControls(false);
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
		}
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		updateSelection : function(object)
		{
			
		},
		
		setMaps : function(layoutMap, height, width)
		{
			
		},
		
		enableControls : function(value)
		{
			
		},
		
		applyMaps : function(e)
		{
			
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