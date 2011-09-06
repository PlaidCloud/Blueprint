/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Adams Tower
*/


/** TODOC
 */
qx.Class.define("designer.ui.TypeMenuButton", {
    extend: qx.ui.toolbar.MenuButton,

    /** TODOC
     */
    construct: function() {
        this._menu = new qx.ui.menu.Menu();
        //this.debug(designer.util.ClassList.getInstance().query("designer.blueprint"));
        var blueprints = designer.util.ClassList.getInstance().query("designer.blueprint");
        for (var i=0; i<blueprints.length; i++) {
            var label = blueprints[i].slice("designer.".length);
            var button = new qx.ui.menu.Button(label);
            button.addListener("execute", this.menuFactory(label), this);
            this._menu.add(button);
        }
        this.base(arguments, "TypeMenuButton!", null, this._menu);
        this.setLabel("Choose a type.");
    },

    properties: {
    },

    members: {
        menuFactory: function(label) {
            return function(e) {
                //this.debug("Adams, TypeMenuButton, " + label + " clicked.");
                this.setLabel(label);
            }
        }
    },

    destruct: function() {
    }
});
