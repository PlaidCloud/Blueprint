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

qx.Class.define("blueprint.ui.window.Window",
{
	extend : qx.ui.window.Window,
	
	include :
	[
	blueprint.MBlueprintManager
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
		
		this.setLayout(blueprint.util.Misc.generateLayout(vData.constructorSettings.innerLayout));
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		
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
