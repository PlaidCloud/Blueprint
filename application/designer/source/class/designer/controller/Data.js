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
		
		if (false) {
		    var bweet = new blueprint.data.controller.List();
		    var bwar = new blueprint.ui.form.RadioGroup();
		}
		
		newForm = {
          "objectClass":"blueprint.ui.container.Composite",
          "objectId":"",
          "type":"top_container",
          "qxSettings":{

          },
          "constructorSettings":{
            "innerLayout":"qx.ui.layout.Canvas"
          },
          "contents":[
            {
              "layoutmap":{
                "top":170,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.RadioButton",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "blueprintRadioGroup":"dataGroup",
                  "label":"Array",
                  "gap":6,
                  "width":100,
                  "height":20
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":130,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.RadioButton",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "blueprintRadioGroup":"dataGroup",
                  "label":"Number",
                  "gap":6,
                  "width":96,
                  "height":16
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":150,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.RadioButton",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "blueprintRadioGroup":"dataGroup",
                  "label":"String",
                  "gap":6,
                  "width":96,
                  "height":16
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":190,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.RadioButton",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "blueprintRadioGroup":"dataGroup",
                  "label":"Object",
                  "gap":6,
                  "width":100,
                  "height":20
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":110,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.RadioButton",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "blueprintRadioGroup":"dataGroup",
                  "label":"Boolean",
                  "gap":6,
                  "width":100,
                  "height":20
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":110,
                "left":130
              },
              "object":{
                "objectClass":"blueprint.ui.form.TextField",
                "objectId":"varName",
                "type":"object",
                "qxSettings":{
                  "paddingTop":2,
                  "paddingRight":4,
                  "paddingBottom":1,
                  "paddingLeft":4,
                  "selectable":true,
                  "width":126,
                  "height":26,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":64,
                "left":54
              },
              "object":{
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "value":"Create New Data Element:",
                  "width":146,
                  "height":16,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":90,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "value":"Type:",
                  "width":100,
                  "height":20,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":90,
                "left":130
              },
              "object":{
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "value":"Variable Name",
                  "width":100,
                  "height":20,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":140,
                "left":130
              },
              "object":{
                "objectClass":"blueprint.ui.form.Button",
                "objectId":"btnAddVariable",
                "type":"object",
                "qxSettings":{
                  "label":"Add Variable",
                  "center":true,
                  "paddingTop":2,
                  "paddingRight":8,
                  "paddingBottom":2,
                  "paddingLeft":8,
                  "width":126,
                  "height":26
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":224,
                "left":54
              },
              "object":{
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "value":"Data Elements:",
                  "width":100,
                  "height":20,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":240,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.List",
                "objectId":"dataList",
                "type":"object",
                "qxSettings":{
                  "width":206,
                  "height":266
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":84,
                "left":264
              },
              "object":{
                "objectClass":"blueprint.ui.form.TextArea",
                "objectId":"dataValueTextArea",
                "type":"object",
                "qxSettings":{
                  "paddingTop":4,
                  "paddingRight":4,
                  "paddingBottom":4,
                  "paddingLeft":4,
                  "selectable":true,
                  "width":446,
                  "height":456
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":64,
                "left":264
              },
              "object":{
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                  "value":"Data Value:",
                  "width":100,
                  "height":20,
                  "allowGrowY":false,
                  "allowShrinkY":false
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":510,
                "left":50
              },
              "object":{
                "objectClass":"blueprint.ui.form.Button",
                "objectId":"btnDelVariable",
                "type":"object",
                "qxSettings":{
                  "label":"Delete Variable",
                  "center":true,
                  "paddingTop":2,
                  "paddingRight":8,
                  "paddingBottom":2,
                  "paddingLeft":8,
                  "width":206,
                  "height":26
                },
                "constructorSettings":{

                }
              }
            },
            {
              "layoutmap":{
                "top":174,
                "left":130
              },
              "object":{
                "objectClass":"blueprint.ui.form.Button",
                "objectId":"btnAddComplexVariable",
                "type":"object",
                "qxSettings":{
                  "label":"Complex Variable",
                  "center":true,
                  "paddingTop":2,
                  "paddingRight":8,
                  "paddingBottom":2,
                  "paddingLeft":8,
                  "width":126,
                  "height":20
                },
                "constructorSettings":{

                }
              }
            }
          ],
          "scripts":{
            "addVariable":"$btnAddVariable.addListener(\"execute\", function(e) {\n  if ($varName.getValue() != \"\") {\n    $dataElements.addElement($varName.getValue(), \"\", $dataGroup.getSelection()[0].getLabel());\n    $varName.setValue(\"\");\n  }\n});",
            "delVariable":"$btnDelVariable.addListener(\"execute\", function(e) {\n  $dataElements.removeElement($dataController.getSelection());\n});"
          },
          "blueprintFunctions":{

          },
          "data":{
            "complex":[
              {
                "objectClass":"designer.data.Elements",
                "objectId":"dataElements",
                "type":"object"
              }
            ]
          },
          "controllers":[
            {
              "objectClass":"blueprint.data.controller.List",
              "objectId":"dataController",
              "type":"object",
              "constructorSettings":{
                "model":"dataElements",
                "target":"dataList"
              }
            },
            {
              "objectClass":"blueprint.ui.form.RadioGroup",
              "objectId":"dataGroup",
              "type":"object",
              "constructorSettings":{

              }
            }
          ],
          "bindings":[
          {
              "sourceId" : "dataController",
              "sourceProperty" : "selection[0]",
              "targetId" : "dataValueTextArea",
              "targetProperty" : "value",
              "converter": "function(value) { try { return $dataElements.getDataValue(value); } catch(e) { return \"Error reading value: \" + e;} }" 
          }
          ]
        };
		
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