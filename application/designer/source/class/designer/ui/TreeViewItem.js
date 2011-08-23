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
qx.Class.define("designer.ui.TreeViewItem", {
    extend: qx.ui.tree.VirtualTreeItem,

    /** TODOC
     */
    /*construct: function() {
    },*/

    properties: {
        generatedId: {
            check: "String",
            nullable: true
        }
    },

    members: {
        _addWidgets: function() {
            this.debug("Adams, TreeViewItem, being made");
            this.addListener("dblclick", this.__onDoubleClick, this);
            
            this.addSpacer();
            this.addOpenButton();
            //this.addIcon();
            this.addLabel();
        },
        
        __onDoubleClick: function(e) {
            qx.core.Init.getApplication().getManager().setSelection(this.getGeneratedId());
        }
    },

    destruct: function() {
    }
});
