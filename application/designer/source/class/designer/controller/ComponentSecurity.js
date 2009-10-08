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

qx.Class.define("designer.controller.ComponentSecurity",
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
		
		var cb_create = new qx.ui.form.CheckBox("Create");
		var cb_read = new qx.ui.form.CheckBox("Read");
		var cb_update = new qx.ui.form.CheckBox("Update");
		var cb_delete = new qx.ui.form.CheckBox("Delete");
		
		this.add(cb_create, {top: 10, left: 10});
		this.add(cb_read, {top: 40, left: 10});
		this.add(cb_update, {top: 70, left: 10});
		this.add(cb_delete, {top: 100, left: 10});
		
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