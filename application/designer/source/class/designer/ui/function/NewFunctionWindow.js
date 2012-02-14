
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

qx.Class.define("designer.ui.function.NewFunctionWindow", {
	extend: designer.ui.window.Window,
	
	construct: function(functionsList) {
		this.base(arguments, "New Function");
		
		this.functionsList = functionsList;
		
		this.setLayout(new qx.ui.layout.Grid());
		
		this._createButton = new qx.ui.form.Button("Create");
		this.add(this._createButton, {row: 1, column: 1});
		this._createButton.addListener("execute", this._createFunction, this);
		
		this._cancelButton = new qx.ui.form.Button("Cancel");
		this.add(this._cancelButton, {row: 1, column: 0});
		this._cancelButton.addListener("execute", this.close, this);
		
		this._label = new qx.ui.basic.Label("Function Name: ");
		this.add(this._label, {row: 0, column: 0});
		
		this._nameInput = new qx.ui.form.TextField();
		this.add(this._nameInput, {row: 0, column: 1});
	},
	
	members: {
		close: function() {
			this._nameInput.setValue("");
			
			this.base(arguments);
		},
		
		_createFunction: function(e) {
			qx.core.Init.getApplication().getManager().createFunction(this._nameInput.getValue());
			this.functionsList.refreshFunctions();
			this.close();
		}
	}
})
