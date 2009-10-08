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

qx.Class.define("designer.controller.Source",
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
	construct : function()
	{
		this.base(arguments, new qx.ui.layout.Canvas());
		
		var back = new qx.ui.embed.Html();
		back.setBackgroundColor("green");
		var fore = new qx.ui.form.TextArea();
		this.setEditorBackground(back);
		this.setEditorForeground(fore);
		
		//this.add(back, {top: 0, right: 600, bottom: 0, left: 0});
		this.add(fore, {top: 0, right: 0, bottom: 0, left: 0});
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		lastKnownGood :
		{
			check: "String",
			init: ""
		},
		
		editorBackground : 
		{	
			check: "qx.ui.embed.Html"
		},
		
		editorForeground :
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
		setValue : function(value)
		{
			this.getEditorForeground().setValue(value);
			this.getEditorBackground().setHtml(value);
		},
		getValue : function()
		{
			return this.getEditorForeground().getValue();
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