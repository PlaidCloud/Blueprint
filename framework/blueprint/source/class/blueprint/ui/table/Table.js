/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2012 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

qx.Class.define("blueprint.ui.table.Table", {
    extend: qx.ui.table.Table,

    include: [
    blueprint.MBlueprintManager],

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct: function(vData, namespace, skipRecursion) {
        this.base(arguments);

        if (vData.constructorSettings.columnWidths) {
            for (var i = 0; i < vData.constructorSettings.columnWidths.length; i++) {
                if (qx.lang.Type.isNumber(vData.constructorSettings.columnWidths[i])) {
                    this.setColumnWidth(i, vData.constructorSettings.columnWidths[i]);
                }
            }
        }

        this.set(vData.qxSettings);
    }
});
