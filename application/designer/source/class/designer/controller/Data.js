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

qx.Class.define("designer.controller.Data",
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
	construct : function(objectTree)
	{
		this.base(arguments, new qx.ui.layout.Dock());
		
		this.setObjectTree(objectTree);
		
		newForm = {"objectClass":"blueprint.ui.container.Composite","objectId":"","type":"top_container","qxSettings":{"decorator":null},"constructorSettings":{"innerLayout":"qx.ui.layout.Canvas"},"contents":[{"layoutmap":{"top":138,"left":18},"object":{"objectClass":"blueprint.ui.form.RadioButton","objectId":"","type":"object","qxSettings":{"label":"Array","icon":"decoration/form/radiobutton.png","gap":6,"focusable":true,"appearance":"radiobutton","width":100,"height":20,"allowGrowX":false},"constructorSettings":{}}},{"layoutmap":{"top":98,"left":18},"object":{"objectClass":"blueprint.ui.form.RadioButton","objectId":"","type":"object","qxSettings":{"label":"Number","icon":"decoration/form/radiobutton.png","gap":6,"focusable":true,"appearance":"radiobutton","width":96,"height":16,"allowGrowX":false},"constructorSettings":{}}},{"layoutmap":{"top":118,"left":18},"object":{"objectClass":"blueprint.ui.form.RadioButton","objectId":"","type":"object","qxSettings":{"label":"String","icon":"decoration/form/radiobutton.png","gap":6,"focusable":true,"appearance":"radiobutton","width":96,"height":16,"allowGrowX":false},"constructorSettings":{}}},{"layoutmap":{"top":158,"left":18},"object":{"objectClass":"blueprint.ui.form.RadioButton","objectId":"","type":"object","qxSettings":{"label":"Object","icon":"decoration/form/radiobutton.png","gap":6,"focusable":true,"appearance":"radiobutton","width":100,"height":20,"allowGrowX":false},"constructorSettings":{}}},{"layoutmap":{"top":78,"left":18},"object":{"objectClass":"blueprint.ui.form.RadioButton","objectId":"","type":"object","qxSettings":{"label":"Boolean","icon":"decoration/form/radiobutton.png","gap":6,"focusable":true,"appearance":"radiobutton","width":100,"height":20,"allowGrowX":false},"constructorSettings":{}}},{"layoutmap":{"top":78,"left":88},"object":{"objectClass":"blueprint.ui.form.TextField","objectId":"","type":"object","qxSettings":{"paddingTop":2,"paddingRight":4,"paddingBottom":1,"paddingLeft":4,"focusable":true,"selectable":true,"appearance":"textfield","width":126,"height":26,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}},{"layoutmap":{"top":28,"left":18},"object":{"objectClass":"blueprint.ui.basic.Label","objectId":"","type":"object","qxSettings":{"value":"Create New Data Element:","appearance":"label","width":146,"height":16,"allowGrowX":false,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}},{"layoutmap":{"top":58,"left":18},"object":{"objectClass":"blueprint.ui.basic.Label","objectId":"","type":"object","qxSettings":{"value":"Type:","appearance":"label","width":100,"height":20,"allowGrowX":false,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}},{"layoutmap":{"top":58,"left":88},"object":{"objectClass":"blueprint.ui.basic.Label","objectId":"","type":"object","qxSettings":{"value":"Variable Name","appearance":"label","width":100,"height":20,"allowGrowX":false,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}},{"layoutmap":{"top":148,"left":88},"object":{"objectClass":"blueprint.ui.form.Button","objectId":"","type":"object","qxSettings":{"label":"Add Variable","center":true,"paddingTop":2,"paddingRight":8,"paddingBottom":2,"paddingLeft":8,"focusable":true,"appearance":"button","width":126,"height":26},"constructorSettings":{}}},{"layoutmap":{"top":188,"left":18},"object":{"objectClass":"blueprint.ui.basic.Label","objectId":"","type":"object","qxSettings":{"value":"Data Elements:","appearance":"label","width":100,"height":20,"allowGrowX":false,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}},{"layoutmap":{"top":208,"left":8},"object":{"objectClass":"blueprint.ui.form.List","objectId":"","type":"object","qxSettings":{"focusable":true,"appearance":"list","width":206,"height":306},"constructorSettings":{}}},{"layoutmap":{"top":48,"left":228},"object":{"objectClass":"blueprint.ui.form.TextArea","objectId":"","type":"object","qxSettings":{"paddingTop":4,"paddingRight":4,"paddingBottom":4,"paddingLeft":4,"focusable":true,"selectable":true,"appearance":"textarea","width":456,"height":466},"constructorSettings":{}}},{"layoutmap":{"top":28,"left":228},"object":{"objectClass":"blueprint.ui.basic.Label","objectId":"","type":"object","qxSettings":{"value":"Data Value:","appearance":"label","width":100,"height":20,"allowGrowX":false,"allowGrowY":false,"allowShrinkY":false},"constructorSettings":{}}}],"blueprintScripts":{}};
		
		var widget = blueprint.Manager.getInstance().generate(newForm, null, "new_variable_form");
		
		this.add(widget);
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