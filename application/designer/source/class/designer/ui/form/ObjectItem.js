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


/**
 * An item in an ObjectList.
 */
qx.Class.define("designer.ui.form.ObjectItem", {
    extend: qx.ui.container.Composite,

    /**
     * Constructs the ObjectItem.
     * @param genId The generated ID of the represented object.
     */
    construct: function(genId) {
        this.base(arguments, new qx.ui.layout.HBox(4));
        
        this.__manager = qx.core.Init.getApplication().getManager();
        
        this.setDraggable(true);
        this.addListener("dragstart", this.__dragStart, this);
        this.addListener("droprequest", this.__dropRequest, this);
        this.addListener("dblclick", this.__doubleClick, this);
        
        this.add(new qx.ui.basic.Label(this.__manager.getObjectId(genId)), {flex: 1});
        this.add(new qx.ui.basic.Label(this.__manager.getObjectClass(genId)), {flex: 1});
        
        this.setGeneratedId(genId);
    },

    properties: {
        /**
         * The generated ID of the represented object.
         */
        generatedId: {
            check: String,
            nullable: true
        }
    },

    members: {
    	__manager : null,
    	
        /**
         * Handles the beginning of one trying to drag the Object.
         */
        __dragStart: function(e) {
            e.addAction("move");
            e.addType("designer/object");
        },
        
        /**
         * Handles the request to drop the object.
         */
        __dropRequest: function(e) {
            var type = e.getCurrentType();
            if (type == "designer/object") {
                e.addData(type, this.getGeneratedId());
            }
        },
        
        /**
         * called when the ObjectItem is double clicked. Changes the
         * layout selection to that object.
         */
        __doubleClick: function(e) {
            qx.core.Init.getApplication().getManager().setSelection(this.getGeneratedId());
        }
    },

    destruct: function() {
    }
});
