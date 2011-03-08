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

qx.Bootstrap.define("designer2.data.Definitions", {
    type : "static",

    statics :
    {
        objects : {
            "Atom" : {
                "objectClass":"blueprint.ui.basic.Atom",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "label":"New Atom",
                    "icon":"designer2/test.png"
                },
                "constructorSettings":{}
            },

            "Image" : {
                "objectClass":"blueprint.ui.basic.Image",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "source":"designer2/test.png"
                },
                "constructorSettings":{}
            },

            "Label" : {
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "value":"New Label"
                },
                "constructorSettings":{}
            },

            "Rich Label" : {
                "objectClass":"blueprint.ui.basic.Label",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "value":"<b>New Label</b>",
                    "rich":true
                },
                "constructorSettings":{}
            },

            "Button" : {
                "objectClass":"blueprint.ui.form.Button",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "label":"New Button"
                },
                "constructorSettings":{}
            },

            "CheckBox" : {
                "objectClass":"blueprint.ui.form.CheckBox",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "label":"New CheckBox"
                },
                "constructorSettings":{}
            },

            "ComboBox" : {
                "objectClass":"blueprint.ui.form.ComboBox",
                "objectId":"",
                "type":"object",
                "qxSettings":{},
                "constructorSettings":{}
            },

            "DateField" : {
                "objectClass":"blueprint.ui.form.DateField",
                "objectId":"",
                "type":"object",
                "qxSettings":{},
                "constructorSettings":{}
            },

            "List" : {
                "objectClass":"blueprint.ui.form.List",
                "objectId":"",
                "type":"object",
                "qxSettings":{},
                "constructorSettings":{}
            },

            "PasswordField" : {
                "objectClass":"blueprint.ui.form.PasswordField",
                "objectId":"",
                "type":"object",
                "qxSettings":{},
                "constructorSettings":{}
            },

            "RadioButton" : {
                "objectClass":"blueprint.ui.form.CheckBox",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "label":"New RadioButton"
                },
                "constructorSettings":{}
            },

            "SelectBox" : {
                "objectClass":"blueprint.ui.form.SelectBox",
                "objectId":"",
                "type":"object",
                "qxSettings":{},
                "constructorSettings":{}
            },

            "Slider" : {
                "objectClass":"blueprint.ui.form.Slider",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "orientation":"horizontal",
                    "width":100
                },
                "constructorSettings":{}
            },

            "Spinner" : {
                "objectClass":"blueprint.ui.form.Spinner",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "minimum":0,
                    "value":50,
                    "maximum":100
                },
                "constructorSettings":{}
            },

            "TextArea" : {
                "objectClass":"blueprint.ui.form.TextArea",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "value":"New TextArea"
                },
                "constructorSettings":{}
            },

            "TextField" : {
                "objectClass":"blueprint.ui.form.TextField",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "value":"New TextField"
                },
                "constructorSettings":{}
            },

            "PlaceHolder" : {
                "objectClass":"blueprint.ui.basic.Atom",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "label":"PlaceHolder Widget",
                    "icon":"designer2/test.png"
                },
                "constructorSettings":{}
            },

            "Canvas - Container" : {
                "objectClass":"blueprint.ui.container.Composite",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "width":100,
                    "height":100
                },
                "constructorSettings":{
                    "innerLayout":"qx.ui.layout.Canvas"
                },
                "contents":[]
            },

            "Dock - Container" : {
                "objectClass":"blueprint.ui.container.Composite",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "width":100,
                    "height":100
                },
                "constructorSettings":{
                    "innerLayout":"qx.ui.layout.Dock"
                },
                "contents":[]
            },

            "GroupBox - Container" : {
                "objectClass":"blueprint.ui.groupbox.GroupBox",
                "objectId":"",
                "type":"object",
                "qxSettings": {
                    "height": 100, 
                    "icon": "", 
                    "legend": "GroupBox", 
                    "width": 100
                },
                "constructorSettings":{
                },
                "contents":[]
            },

            "Table" : {
                "objectClass":"blueprint.ui.table.Table",
                "objectId":"",
                "type":"object",
                "qxSettings":{
                    "width":300,
                    "height":200
                },
                "constructorSettings":{

                },
                "components":{
                    "tableModel":{
                        "objectClass":"blueprint.ui.table.model.Simple",
                        "objectId":"",
                        "type":"object",
                        "qxSettings":{

                        },
                        "constructorSettings":{
                            "columns":[
                            "Col1",
                            "Col2"
                            ],
                            "rowData":[
                            ]
                        }
                    }
                }
            }
        }
    }
});