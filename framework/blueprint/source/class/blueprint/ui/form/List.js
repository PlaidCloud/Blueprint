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

qx.Class.define("blueprint.ui.form.List",
{
	extend : qx.ui.form.List,
	
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
		
		if (vData.constructorSettings.listitems) {
		    this.setBlueprintListItems(vData.constructorSettings.listitems);
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
		setBlueprintListItems : function(listitems) {
			for (var i=0; i<listitems.length; i++) {
				this.add(new qx.ui.form.ListItem(listitems[i]["label"], listitems[i]["icon"], listitems[i]["value"]));
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