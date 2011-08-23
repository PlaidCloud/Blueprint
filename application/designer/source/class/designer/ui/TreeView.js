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
qx.Class.define("designer.ui.TreeView", {
    extend: qx.ui.tree.VirtualTree,

    /** TODOC
     */
    construct: function() {
        this.debug("Adams, TreeView, in constructor.");
        var r = {name: "root", children: []};
        var tree = qx.data.marshal.Json.createModel(r, true);
        this.base(arguments, tree, "name", "children");
    },

    properties: {
    },

    members: {
    },

    destruct: function() {
    }
});
