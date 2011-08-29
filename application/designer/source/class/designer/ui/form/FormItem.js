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
qx.Class.define("designer.ui.form.FormItem", {
    extend: qx.ui.container.Composite,

    /** TODOC
     */
    construct: function(genId, list) {
        this.base(arguments, new qx.ui.layout.HBox());
        
        this.setDroppable(true);
        this.addListener("drop", this.__drop, this);
        
        if (genId != null) {
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
        }
        
        this.setGeneratedId(genId);
        
        this._list = list;
        
        this.addListener("click", this.__onClick, this);
    },

    properties: {
        generatedId: {
            check: String,
            nullable: true
        }
    },

    members: {
        _list: null,
        __onClick: function(e) {
            this.debug("Adams, FormItem, clicked: " + this.getGeneratedId());
            this._list.setSelection(this);
        },
        
        __drop: function(e) {
            var genId = e.getData("designer/object");
            
            this.debug("Adams, FormItem: " + genId + " dropped on " + this.getGeneratedId());
            
            qx.core.Init.getApplication().getManager().moveFormObject(genId, this.getGeneratedId());
            
            this._list.getObjectList().refreshObjects();
        },
        
        highlight: function() {
            this.setDecorator("selected");
        },
        
        unhighlight: function() {
            this.setDecorator(null);
        }
    },

    destruct: function() {
    }
});
