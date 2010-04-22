/* ************************************************************************

Tartan Blueprint

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

qx.Class.define("blueprint.ui.form.SelectBox",
{
	extend : qx.ui.form.SelectBox,
	
	include :
	[
	blueprint.MBlueprintManager,
	blueprint.ui.form.MSubmitElement
	],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(vData, namespace, skipRecursion)
	{
		this.base(arguments);
		
		this.set(vData.qxSettings);
		
		if (vData.constructorSettings.selectitems) {
		    this.setBlueprintListItems(vData.constructorSettings.selectitems);
		}
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
		setBlueprintListItems : function(selectitems) {
			for (var i=0; i<selectitems.length; i++) {
				this.add(new qx.ui.form.ListItem(selectitems[i]["label"], selectitems[i]["icon"], selectitems[i]["value"]));
			}
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