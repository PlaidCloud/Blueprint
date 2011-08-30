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
qx.Class.define("designer.ui.form.AddFormWindow", {
    extend: qx.ui.window.Window,

    /** TODOC
     */
    construct: function(list) {
        this.base(arguments, "Add Form");
        this.setLayout(new qx.ui.layout.Grid());
        
        this._list = list;
        
        this._addButton = new qx.ui.form.Button("Add");
        this.add(this._addButton, {row: 1, column: 1});
        this._addButton.addListener("click", this._addForm, this);
        
        this._cancelButton = new qx.ui.form.Button("Cancel");
        this.add(this._cancelButton, {row: 1, column: 0});
        this._cancelButton.addListener("click", this.close, this);
        
        this._label = new qx.ui.basic.Label("Form Name: ");
        this.add(this._label, {row: 0, column: 0});
        
        this._nameInput = new qx.ui.form.TextField();
        this.add(this._nameInput, {row: 0, column: 1});
    },

    properties: {
    },

    members: {
        close: function() {
            this._nameInput.setValue("");
            
            this.base(arguments);
        },
        
        _addForm: function(e) {
            qx.core.Init.getApplication().getManager().createForm(this._nameInput.getValue());
            
            this._list.refreshForms();
            
            this.close();
        }
    },

    destruct: function() {
    }
});
