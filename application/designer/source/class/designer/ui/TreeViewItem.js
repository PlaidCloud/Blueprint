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
        },
        
        objectClass: {
            check: "String",
            nullable: true,
            event: "changeObjectClass"
        },
        
        objectId: {
            check: "String", 
            nullable: true,
            event: "changeObjectId"
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
            
            //this.addWidget(new qx.ui.core.Spacer(), {flex: 1});
            
            //var man = qx.core.Init.getApplication().getManager()
            
            //this.debug("Adams, TreeViewItem, generated Id: " + this.getGeneratedId());
            
            //if (this.getGeneratedId() && this.getGeneratedId() != "Json not loaded yet.") {
                //this.__idDisplay = new qx.ui.basic.Label(man.getObjectId(this.getGeneratedId()));
                this.__idDisplay = new qx.ui.basic.Label();
                this.bind("objectId", this.__idDisplay, "value");
                this.__idDisplay.setTextAlign("left");
                this.__idDisplay.setWidth(100);
                this.addWidget(this.__idDisplay);
            
                //this.__classDisplay = new qx.ui.basic.Label(man.getObjectClass(this.getGeneratedId()));
                this.__classDisplay = new qx.ui.basic.Label();
                this.bind("objectClass", this.__classDisplay, "value");
                this.__classDisplay.setTextAlign("left");
                this.__classDisplay.setWidth(150);
                this.addWidget(this.__classDisplay);
            //}
            
        },
        
        __idDisplay: null,
        __classDisplay: null,
        
        __onDoubleClick: function(e) {
            qx.core.Init.getApplication().getManager().setSelection(this.getGeneratedId());
        }
    },

    destruct: function() {
    }
});
