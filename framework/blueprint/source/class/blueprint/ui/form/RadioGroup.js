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

qx.Class.define("blueprint.ui.form.RadioGroup",
{
    extend : qx.ui.form.RadioGroup,

    include :
    [
    blueprint.MBlueprintManager,
    blueprint.ui.form.MSubmitElement
    ],

    implement : [
    qx.ui.form.IForm,
    qx.ui.form.IStringForm
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
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        value :
        {
            check : "String",
            apply : "_applyValue",
            event : "changeValue",
            nullable : true
        }
    },

    events : {
        "changeValue" : "qx.event.type.Data"
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        _applyValue : function(value, old)
        {
            var children = this.getChildren();
            
            for (var i=0;i<children.length;i++) {
                if (children[i].getSelectedValue() == value) {
                    children[i].setValue(true);
                    break;
                }
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