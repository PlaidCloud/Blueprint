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

//THIS COULD BE DANGEROUS! WILL LIKELY NEED TO BE CHANGED FOR EXTERNAL USE!

qx.Class.define("designer.ui.LoadJsonWindow", {
	extend: qx.ui.window.Window,
	
	construct: function() {
		this.base(arguments, "Load a json definition.");
		var grid = new qx.ui.layout.Grid();
		grid.setColumnWidth(0,150);
		grid.setColumnWidth(1,150);
		//grid.setRowHeight(0, 300);
		this.setLayout(grid);
		
		this._filenameField = new qx.ui.form.TextField("resource/designer/examples/Login.json");
		this.add(this._filenameField, {row: 0, column: 0, colSpan: 2});
		
		this._cancelButton = new qx.ui.form.Button("Cancel");
		this._cancelButton.addListener("execute", this.close, this);
		this.add(this._cancelButton, {row: 1, column: 0});
		
		this._loadButton = new qx.ui.form.Button("Load");
		this._loadButton.addListener("execute", this.load, this);
		this.add(this._loadButton, {row: 1, column: 1});
	},
	
	members: {
		load: function(e) {
			this.debug("Adams, Well, I should be loading " + this._filenameField.getValue());
			var request = new qx.io.request.Xhr(this._filenameField.getValue());
			
			request.addListener("success", function(e) {
				try {
					var obj = designer.util.JsonError.validate(request.getResponse()).object;
				} catch (e) {
					//throw ("Invalid Json document.");
					designer.util.Misc.plaidAlert("Unable to load Json document. Most likely it doesn't fit the schema.");
				}
				qx.core.Init.getApplication().getManager().importTopContainer(obj);
				this.close();
			}, this);
			
			request.send();
		}
	}
})
