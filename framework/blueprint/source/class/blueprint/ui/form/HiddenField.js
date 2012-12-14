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

qx.Class.define("blueprint.ui.form.HiddenField", {
    extend: qx.ui.core.Widget,

    include: [
    blueprint.MBlueprintManager, blueprint.ui.form.MSubmitElement],

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

        this.set(vData.qxSettings);

        this.set({
            "height": 0,
            "width": 0
        });
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {
        name: {
            check: "String"
        },

        value: {
            check: "String"
        }
    }
});
