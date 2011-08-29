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
qx.Class.define("designer.ui.form.FormList", {
    extend: qx.ui.container.SlideBar,

    /** TODOC
     */
    construct: function() {
        this.base(arguments);
        
        this.setOrientation("vertical");
        this.setLayout(new qx.ui.layout.VBox());
        
        this._refreshForms();
        
        //var that = this;
        qx.core.Init.getApplication().getManager().addListener("jsonLoaded", this._refreshForms, this);
        
        //this.addListener("changeSelection", function() {this.debug("Adams, selection changed to: " + this.getSelection())}, this);
    },

    properties: {
        selection: {
            nullable: true,
            event: "changeSelection",
            apply: "_applySelection"
        },
        objectList: {
            check: "designer.ui.form.ObjectList"
        }
    },

    members: {
        _refreshForms: function(e) {
            this.removeAll();
            var formlist = qx.core.Init.getApplication().getManager().getForms();
            //this.debug("Adams, FormList, formlist: " + formlist);
            /*var formlist = [];
            for (var i=0; i <= 300; i++) {
                formlist.push("objfake" + i);
            }*/
            this.add(new designer.ui.form.UnassignedFormItem(this));
            if (formlist.length > 0) {
                for (var i=0; i<formlist.length; i++) {
                    this.add(new designer.ui.form.FormItem(formlist[i], this));
                }
            } else {
                this.add(new qx.ui.basic.Label("No forms."));
            }
        },
        
        _applySelection: function(value, old) {
            if (old) {
                old.unhighlight();
            }
            
            if (value) {
                value.highlight();
            }
            
            return value;
        }
    },

    destruct: function() {
    }
});
