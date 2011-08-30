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
 * A Page for manipulating forms, that goes in the tabview at the top of
 * designer.
 */
qx.Class.define("designer.ui.FormPage", {
    extend: qx.ui.tabview.Page,

    /**
     * Constructs the Form page.
     */
    construct: function() {
        this.base(arguments, "Form");
        this.setPadding(2);
        this.setLayout(new qx.ui.layout.Dock());
        
        var toolbar = new qx.ui.toolbar.ToolBar();
        this.add(toolbar, {edge: "north"});
        
        this._container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        this.add(this._container, {edge: "center"});
        
        this._formBox = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        this._formBox.setDecorator("pane");
        this._formBox.setPadding(3, 3, 3, 3);
        this._container.add(this._formBox);
        
        this._formList = new designer.ui.form.FormList();
        this._formList.setWidth(350);
        this._formBox.add(this._formList);
        
        this._addFormWindow = new designer.ui.form.AddFormWindow(this._formList); 
        
        var addFormButton = new qx.ui.toolbar.Button("Add Form");
        toolbar.add(addFormButton);
        
        addFormButton.addListener("click", function(e) {
            this._addFormWindow.show();
        }, this);
        
        this._objectBox = new qx.ui.container.Composite(new qx.ui.layout.Grow());
        this._objectBox.setDecorator("pane");
        this._objectBox.setPadding(3, 3, 3, 3);
        this._container.add(this._objectBox);
        
        this._objectList = new designer.ui.form.ObjectList(this._formList);
        this._objectList.setWidth(350);
        this._objectBox.add(this._objectList);
        
        this._formList.setObjectList(this._objectList);
        
        this._actionEditor = new designer.ui.form.ActionEditor();
        this._container.add(this._actionEditor)
    },

    properties: {
    },

    members: {
    },

    destruct: function() {
    }
});
