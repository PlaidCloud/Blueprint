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

    properties: {
        generatedId: {
            check: "String",
            nullable: true,
            event: "changeGeneratedId"
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
            //TODO: come back here and make this look better
            //      Looks a bit better now, but could probably be improved.
            this.addListener("dblclick", this.__onDoubleClick, this);
            
            this.addSpacer();
            this.addOpenButton();
            this.__genIdDisplay = new qx.ui.basic.Label();
            this.bind("generatedId", this.__genIdDisplay, "value");
            this.__genIdDisplay.setWidth(50);
            this.addWidget(this.__genIdDisplay);
            
            this.addWidget(new qx.ui.core.Spacer(), {flex: 1});

            this.__idDisplay = new qx.ui.basic.Label();
            this.bind("objectId", this.__idDisplay, "value");
            this.__idDisplay.setWidth(100);
            this.addWidget(this.__idDisplay);
        
            this.__classDisplay = new qx.ui.basic.Label();
            this.bind("objectClass", this.__classDisplay, "value");
            this.__classDisplay.setWidth(200);
            this.addWidget(this.__classDisplay);
        },
        
        __genIdDisplay: null,        
        __idDisplay: null,
        __classDisplay: null,
        
        __onDoubleClick: function(e) {
            qx.core.Init.getApplication().getManager().setSelection(this.getGeneratedId());
        }
    }
});
