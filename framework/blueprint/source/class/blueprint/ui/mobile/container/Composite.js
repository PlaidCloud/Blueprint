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

qx.Class.define("blueprint.ui.mobile.container.Composite", {
    extend: qx.ui.mobile.container.Composite,

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
        var new_layout;
        if (qx.lang.Type.isString(vData.constructorSettings.innerLayout)) {
            new_layout = blueprint.util.Misc.generateLayout(vData.constructorSettings.innerLayout);
            
            if (vData.constructorSettings.layoutSettings) {
                new_layout.set(vData.constructorSettings.layoutSettings);
            }
        }

        this.base(arguments, new_layout);

        this.set(vData.qxSettings);
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {},

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members: {

    }
});
