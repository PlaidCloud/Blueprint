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

qx.Class.define("blueprint.ui.menu.Button", {
    extend: qx.ui.menu.Button,

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

        this.set(vData.qxSettings);
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members: {
        postMixinConstruct: function(vData, namespace, skipRecursion) {
            if (vData.contents) {
                var menu = new qx.ui.menu.Menu();

                for (var i = 0; i < vData.contents.length; i++) {
                    menu.add(blueprint.Manager.getInstance().generate(vData.contents[i].object, this, namespace));
                }

                this.setMenu(menu);
            }
        }
    }
});
