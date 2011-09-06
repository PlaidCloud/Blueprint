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
qx.Class.define("designer.placeholder.EditableLeaf", {
    extend: designer.placeholder.Leaf,

    /** TODOC
     */
    construct: function() {
        this.base(arguments);
        this.addListener("dblclick", this._edit, this);
    },

    properties: {
    },

    members: {
        _edit: function(e) {
            this.debug("Adams, EditableLeaf, " + this.getRepClassName() + " has no _edit method.");
        }
    },

    destruct: function() {
    }
});
