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

qx.Class.define("blueprint.ui.treevirtual.TreeVirtual",
{
    extend : qx.ui.treevirtual.TreeVirtual,

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
        this.base(arguments, vData.constructorSettings.headings, vData.constructorSettings.custom);

        this.set(vData.qxSettings);
        
        var dataModel = this.getDataModel();
        if (vData.constructorSettings.treeData) {
            dataModel.setData(vData.constructorSettings.treeData);
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