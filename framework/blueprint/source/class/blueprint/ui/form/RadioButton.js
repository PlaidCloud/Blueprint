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

qx.Class.define("blueprint.ui.form.RadioButton",
{
	extend : qx.ui.form.RadioButton,
	
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
		
		//blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.radioGroup).add(this);
	},
	
	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		blueprintRadioGroup:
		{
		    check: "String",
		    init: "",
		    apply: "_setRadioGroup"
		}
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
    {
        _setRadioGroup : function(value, old)
        {
            if (old != undefined) {
                blueprint.util.Registry.getInstance().get(this, old).remove(this);
            }
            blueprint.util.Registry.getInstance().get(this, value).add(this);
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