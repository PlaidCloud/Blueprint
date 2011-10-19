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

qx.Class.define("designer.ui.script.FunctionsList", {
	extend: qx.ui.container.SlideBar,
	
	construct: function() {
		this.base(arguments);
		
		this.setOrientation("vertical");
		this.setLayout(new qx.ui.layout.VBox());
		
		this.refreshFunctions();
		
		qx.core.Init.getApplication().getManager().addListener("jsonLoaded", this.refreshFunctions, this);
	},
	
	properties: {
		selection: {
			nullable: true,
			event: "changeSelection",
			apply: "_applySelection"
		},
		fellow: {
			nullable: true
		},
		editor: {
			nullable: true
		}
	},
	
	members: {
		refreshFunctions: function(e) {
			this.removeAll();
			
			var functionlist = ["function1", "function2", "function3"];
			
			if (functionlist.length > 0) {
				for (var i=0; i<functionlist.length; i++) {
					this.add(new designer.ui.script.FunctionItem(functionlist[i], this));
				}
			} else {
				this.add(new qx.ui.basic.Label("No functions."));
			}
		},
		
		_applySelection: function(value, old) {
			if (old) {
				old.unhighlight();
			}
			
			if (value) {
				value.highlight();
				if (this.getFellow()) {
					this.getFellow().setSelection(null);
				}
				if (this.getEditor()) {
					this.getEditor().setCode(value.getGeneratedId()); //replace with actual script
					this.getEditor().setCaption(value.getGeneratedId());
				}
			}
			
			return value;
		}
	}
});
