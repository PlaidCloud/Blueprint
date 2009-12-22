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

qx.Class.define("designer.selector.Boolean",
{
    extend  : qx.ui.core.Widget,

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct : function(options)
    {
        this.base(arguments);
        var layout = new qx.ui.layout.HBox(5);
        layout.setAlignY("middle");
        this._setLayout(layout);

        var selectBox = new qx.ui.form.SelectBox();

        var nullItem = new qx.ui.form.ListItem("null");
        var trueItem = new qx.ui.form.ListItem("True");
        var falseItem = new qx.ui.form.ListItem("False");

        selectBox.add(nullItem);
        selectBox.add(trueItem);
        selectBox.add(falseItem);

        var modelSkeleton = {value: null};
        var model = qx.data.marshal.Json.createModel(modelSkeleton);
        var controller = new qx.data.controller.Object(model);
        
        var model2Value = {
            converter : function(data) {
                return data === 1;
            }
        }
        var value2Model = {
            converter : function(data) {
                return data ? 1 : 0;
            }
        }
        controller.addTarget(
            okCheckBox, "value", "ok", true, model2Value, value2Model
        );

        this._add(new qx.ui.basic.Label("Name:"));
        this._add(selectBox);
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        name :
        {
            check: "String"
        },

        value :
        {
            nullable: true,
            check: "Boolean"
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