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

qx.Class.define("designer.list.Control",
{
	extend  : qx.ui.form.List,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(horizontal)
	{
		this.base(arguments, horizontal);
		
		this.setWidth(250);
		
		var buttonObj = {
			"qxSettings": {
				"label": "NewButton"
			},
			"constructorSettings": {}
		};
		
		var genericObj = {
			"qxSettings": {},
			"constructorSettings": {}
		};
		
		var layoutObj = {
			"qxSettings": {
				"height": 200,
				"width": 200
			},
			"constructorSettings": {
				"innerLayout": "qx.ui.layout.Canvas"
			}
		};
		
		var layoutPaneObj = {
			"qxSettings": {
				"height": 200,
				"width": 200,
				"decorator": "pane"
			},
			"constructorSettings": {
				"innerLayout": "qx.ui.layout.Canvas"
			}
		};
		
		var layoutPaneDockObj = {
			"qxSettings": {
				"height": 200,
				"width": 200,
				"decorator": "pane"
			},
			"constructorSettings": {
				"innerLayout": "qx.ui.layout.Dock"
			}
		};
		
		this.add(new designer.list.ControlItem("Blueprint Container", null, null, blueprint.ui.container.Composite, layoutObj));
		this.add(new designer.list.ControlItem("Pane Container", null, null, blueprint.ui.container.Composite, layoutPaneObj));
		this.add(new designer.list.ControlItem("Dock Container", null, null, blueprint.ui.container.Composite, layoutPaneDockObj));
		this.add(new designer.list.ControlItem("Button", null, null, blueprint.ui.form.Button, buttonObj));
		this.add(new designer.list.ControlItem("CheckBox", null, null, blueprint.ui.form.CheckBox, buttonObj));
		this.add(new designer.list.ControlItem("ToolBar", null, null, blueprint.ui.toolbar.ToolBar, genericObj));
		//this.add(new designer.list.ControlItem("ToolBar Button", null, null, blueprint.ui.toolbar.Button, buttonObj));
		this.add(new designer.list.ControlItem("DateField", null, null, blueprint.ui.form.DateField, genericObj));
		this.add(new designer.list.ControlItem("PasswordField", null, null, blueprint.ui.form.PasswordField, genericObj));
		//this.add(new designer.list.ControlItem("RadioButton", null, null, blueprint.ui.form.RadioButton, genericObj));
		//this.add(new designer.list.ControlItem("SelectBox", null, null, blueprint.ui.form.SelectBox, genericObj));
		this.add(new designer.list.ControlItem("Slider", null, null, blueprint.ui.form.Slider, genericObj));
		this.add(new designer.list.ControlItem("Spinner", null, null, blueprint.ui.form.Spinner, genericObj));
		this.add(new designer.list.ControlItem("TextArea", null, null, blueprint.ui.form.TextArea, genericObj));
		this.add(new designer.list.ControlItem("TextField", null, null, blueprint.ui.form.TextField, genericObj));
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