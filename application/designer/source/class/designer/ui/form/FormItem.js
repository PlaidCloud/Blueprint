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
        //this.debug("Adams, FormItem, genId: " + genId);
        this.add(new qx.ui.basic.Label(genId));
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
