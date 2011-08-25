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
qx.Class.define("designer.ui.FormPage", {
    extend: qx.ui.tabview.Page,

    /** TODOC
     */
    construct: function() {
        this.base(arguments, "Form");
        this.setPadding(2);
        this.setLayout(new qx.ui.layout.HBox());
        
        this._formBox = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        this._formBox.setDecorator("pane");
        this._formBox.setPadding(3, 3, 3, 3);
        this.add(this._formBox);
        
        this._formList = new designer.ui.form.FormList();
        this._formList.setWidth(300);
        this._formBox.add(this._formList);
        
        this._objectBox = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        this._objectBox.setDecorator("pane");
        this._objectBox.setPadding(3, 3, 3, 3);
        this.add(this._objectBox);
        
        this._objectList = new designer.ui.form.ObjectList();
        this._objectList.setWidth(300);
        this._objectBox.add(this._objectList);
        
        this._actionEditor = new designer.ui.form.ActionEditor();
        this.add(this._actionEditor)
    },

    properties: {
    },

    members: {
    },

    destruct: function() {
    }
});
