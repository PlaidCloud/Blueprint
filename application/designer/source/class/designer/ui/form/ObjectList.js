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
qx.Class.define("designer.ui.form.ObjectList", {
    extend: qx.ui.container.SlideBar,

    /** TODOC
     */
    construct: function(formList) {
        this.base(arguments);
        
        this.setOrientation("vertical");
        this.setLayout(new qx.ui.layout.VBox());
        
        this._formList = formList;
        
        this.add(new qx.ui.basic.Label("No form selected."));
        
        this._formList.addListener("changeSelection", this._refreshObjects, this);
    },

    properties: {
    },

    members: {
        _formList: null,
        _refreshObjects: function(e) {
            this.removeAll();
            if (this._formList.getSelection() /*true*/) {
                var objectlist = qx.core.Init.getApplication().getManager().getFormObjects(this._formList.getSelection().getGeneratedId());
                /*var objectlist = [];
                for(var i=0; i<= 10; i++) {
                    objectlist.push(this._formList.getSelection().getGeneratedId() + ":" + i);
                }*/
                if (objectlist.length > 0) {
                    for (var i=0; i<objectlist.length; i++) {
                        this.add(new designer.ui.form.ObjectItem(objectlist[i], this));
                    }
                } else {
                    this.add(new qx.ui.basic.Label("Empty form."));
                }
            } else {
                this.add(new qx.ui.basic.Label("No form selected."));
            }
            
            
        }
    },

    destruct: function() {
    }
});
