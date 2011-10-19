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

qx.Class.define("designer.ui.script.FunctionItem", {
	extend: qx.ui.container.Composite,
	
	construct: function(genId, list) {
		this.base(arguments, new qx.ui.layout.HBox());
		
		if (genId != null) {
			var genIdLabel = new qx.ui.basic.Label(genId);
			genIdLabel.setWidth(50);
			this.add(genIdLabel);
			
			var functionName;
			
			if (functionName = null /*get from manager*/) {
				var functionNameLabel = new qx.ui.basic.Label(functionName);
				functionNameLabel.setWidth(100);
				this.add(functionNameLabel);
			} else {
				this.add(new qx.ui.core.Spacer(100));
			}
			
			/* probably something about args here*/
		}
		
		this.setGeneratedId(genId);
		
		this._list = list;
		
		this.addListener("click", this.__onClick, this);
	},
	
	properties: {
		generatedId: {
			check: String,
			nullable: true
		}
	},
	
	members: {
		_list: null,
		__onClick: function(e) {
			this._list.setSelection(this);
		},
		highlight: function() {
			this.setDecorator("selected");
		},
		unhighlight: function() {
			this.setDecorator(null);
		}
	}
});
