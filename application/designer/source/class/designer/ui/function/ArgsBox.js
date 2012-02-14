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

qx.Class.define("designer.ui.function.ArgsBox", {
	extend: qx.ui.container.Composite,
	
	construct: function() {
		this.base(arguments);
		
		this.setLayout(new qx.ui.layout.HBox());
		
		this.add(new qx.ui.basic.Label("Args"));
		
		this.__field = new qx.ui.form.TextField().set({
			"width": 1000
		});
		this.add(this.__field);
	},
	
	members: {
		setArgs: function(a) {
			this.__field.setValue(a.join(", "));
		},
		getArgs: function() {
			return this.__field.getValue().replace(/\s/g, "").split(",");
		}
	}
})
