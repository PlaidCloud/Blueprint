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
qx.Class.define("designer.ui.form.ObjectItem", {
    extend: qx.ui.container.Composite,

    /** TODOC
     */
    construct: function(genId) {
        this.base(arguments, new qx.ui.layout.HBox());
        
        this.setDraggable(true);
        this.addListener("dragstart", this.__dragStart, this);
        this.addListener("droprequest", this.__dropRequest, this);
        
        var genIdLabel = new qx.ui.basic.Label(genId);
        genIdLabel.setWidth(50);
        this.add(genIdLabel);
        
        var objId;
        
        if (objId = qx.core.Init.getApplication().getManager().getObjectId(genId)) {
            var objIdLabel = new qx.ui.basic.Label(objId);
            objIdLabel.setWidth(100);
            this.add(objIdLabel);
        } else {
            this.add(new qx.ui.core.Spacer(100));
        }
        
        var objClass;
        
        if (objClass = qx.core.Init.getApplication().getManager().getObjectClass(genId)) {
            var objClassLabel = new qx.ui.basic.Label(objClass);
            objClassLabel.setWidth(200);
            this.add(objClassLabel);
        } else {
            this.add(new qx.ui.core.Spacer(200));
        }
        
        this.setGeneratedId(genId);
    },

    properties: {
        generatedId: {
            check: String,
            nullable: true
        }
    },

    members: {
        __dragStart: function(e) {
            e.addAction("move");
            
            e.addType("designer/object");
        },
        
        __dropRequest: function(e) {
            var type = e.getCurrentType();
            
            if (type == "designer/object") {
                e.addData(type, this.getGeneratedId());
            }
        }
    },

    destruct: function() {
    }
});
