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
qx.Class.define("designer.ui.tabview.page.common.Form", {
	extend: designer.ui.tabview.page.Abstract,
	type: "abstract",

	/**
	* Constructs the Form page.
	*/
	construct: function(label, icon) {
		this.base(arguments, label, icon);
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
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
		this._deleteFormWindow = new designer.ui.form.DeleteFormWindow(this._formList); 
		
		var addFormButton = new qx.ui.toolbar.Button("Add Form", "fugue/icons/blue-document--plus.png");
		this.getTabButtons().push(addFormButton);
		
		var deleteFormButton = new qx.ui.toolbar.Button("Delete Form", "fugue/icons/blue-document--minus.png");
		this.getTabButtons().push(deleteFormButton);
		
		addFormButton.addListener("execute", this.__addForm, this);
		
		deleteFormButton.addListener("execute", this.__deleteForm, this);
		
		this._objectBox = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this._objectBox.setDecorator("pane");
		this._objectBox.setPadding(3, 3, 3, 3);
		this._container.add(this._objectBox);
		
		this._objectList = new designer.ui.form.ObjectList(this._formList);
		this._objectList.setWidth(350);
		this._objectBox.add(this._objectList);
		
		this._formList.setObjectList(this._objectList);
		
		this._actionEditor = new designer.ui.form.ActionEditor();
		this._container.add(this._actionEditor);
	},

	properties: {
	},

	members: {
		__addForm : function(e) {
			this._addFormWindow.show();
		},
		
		__deleteForm : function(e) {
			if (this._formList.getSelection() && this._formList.getSelection().getGeneratedId()) {
				this._deleteFormWindow.show(this._formList.getSelection().getGeneratedId());
			} else {
				//TODO: add a user visible dialog here
				this.debug("Nothing to delete.");
			}
		}
	},

	destruct: function() {
	}
});
