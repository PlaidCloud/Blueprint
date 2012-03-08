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
qx.Class.define("designer.ui.form.DeleteFormWindow", {
	extend: designer.ui.window.Window,

	/** TODOC
	*/
	construct: function(flist) {
		this.base(arguments, "Delete Form");
		var grid = new qx.ui.layout.Grid();
		grid.setColumnWidth(0, 150)
		grid.setColumnWidth(1, 150);
		this.setLayout(grid);
		
		//this.setWidth(1000);
		
		this._flist = flist;
		
		this._yesButton = new qx.ui.form.Button("Yes, delete the form.");
		this.add(this._yesButton, {row: 1, column: 1});
		this._yesButton.addListener("execute", this._deleteForm, this);
		
		this._noButton = new qx.ui.form.Button("No, I want to reconsider.");
		this.add(this._noButton, {row: 1, column: 0});
		this._noButton.addListener("execute", this.close, this);
		
		//DONE: display the name of the selected form
		this._label = new qx.ui.basic.Label("IMABOUTASLONGASINEEDTOBETOHAVEANAPPROPRIATEWIDTHFORTHISLABELWITHOUTCUTTINGOFFANYTHINGBUTWIDTHDOESNTWORKTHATWAYAPPARENTLY.");
		this.add(this._label, {row: 0, column: 0, colSpan: 2});
		this.bind("formToDelete", this._label, "value", {
			converter: function (data, model, source, target) {
				if (data) {
					return("Are you sure you want to delete the form named " + qx.core.Init.getApplication().getManager().getObjectId(data) + "?")
				} else {
					return("No form selected.");
				}
			}
		});
	},

	properties: {
		formToDelete: {
			check: "String",
			nullable: true,
			init: null,
			event: "changeFormToDelete"
		}
	},

	members: {
		show: function(genId) {
			this.setFormToDelete(genId);
			this.base(arguments);
		},
		_deleteForm: function(e) {
			qx.core.Init.getApplication().getManager().deleteForm(this.getFormToDelete());
			this._flist.refreshForms();
			this.close();
		}
	},

	destruct: function() {
	}
});
