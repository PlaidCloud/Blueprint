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
 * A list of objects associated with a particular form.
 */
qx.Class.define("designer.ui.form.ObjectList", {
    extend: qx.ui.container.SlideBar,

    /**
     * Constructs the Object List.
     * @param formList The FormList paired with this ObjectList.
     */
    construct: function(formList) {
        this.base(arguments);
        
        this.setOrientation("vertical");
        this.setLayout(new qx.ui.layout.VBox(2));
        
        this._formList = formList;
        
        this.add(new qx.ui.basic.Label("No form selected."));
        
        this._formList.addListener("changeSelection", this.refreshObjects, this);
    },

    properties: {
    },

    members: {
        _formList: null,
        /**
         * Asks the manager for all the objects associated with the
         * selected form, and displays them.
         */
        refreshObjects: function(e) {
            this.removeAll();
            if (this._formList.getSelection()) {
                var objectlist = qx.core.Init.getApplication().getManager().getFormObjects(this._formList.getSelection().getGeneratedId());
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
