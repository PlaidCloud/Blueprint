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

qx.Class.define("designer.list.ControlItem",
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
	construct : function(label, icon, value, object, vData, popupEdit)
	{
		this.base(arguments, label, icon, value);
		
		this.setDraggable(true);
		
		this.addListener("dragstart", function(e) {
			e.addAction("copy");
			e.addType("blueprint/control-items");
		});

		this.__object = object;
		this.__vData = vData;
		this.__popupEdit = popupEdit;
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
		__popupEdit : null,
		
		getControlItem : function()
		{
			return new designer.widget.Mutable(new this.__object(this.__vData), this.__popupEdit);
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