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

qx.Class.define("designer.list.InternalItem",
{
	extend  : qx.ui.form.ListItem,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(label, icon, value, object, vData)
	{
		this.base(arguments, label, icon, value);
		
		this.setDraggable(true);
		
		this.addListener("dragstart", function(e) {
			e.addAction("copy");
			e.addType("blueprint/internal-items");
		});

		this.__object = object;
		this.__vData = vData;
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		__object : null,
		__vData : null,
		
		getControlItem : function()
		{
			return new this.__object(this.__vData);
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