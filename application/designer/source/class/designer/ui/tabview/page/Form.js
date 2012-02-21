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
qx.Class.define("designer.ui.tabview.page.Form", {
	extend: designer.ui.tabview.page.common.Form,

	/**
	* Constructs the Form page.
	*/
	construct: function() {
		this.base(arguments, "Form");
		
		this._actionEditor = new designer.ui.form.ActionEditor();
		this._container.add(this._actionEditor);
	},

	properties: {
	},

	members: {
	},

	destruct: function() {
	}
});
