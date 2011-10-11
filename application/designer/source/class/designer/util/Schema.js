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

qx.Class.define("designer.util.Schema", {
	type: "singleton",

	extend: qx.core.Object,
	
	members:{
		_paths: {
			"blueprint": "resource/designer/blueprint.schema.json",
			"plaid": "resource/builder/plaid.schema.json"
		},
		init: function(whichone) {
			//DONE: change this to be different between designer and plaid
			
			var request = new qx.io.request.Xhr(this._paths[whichone]);
		
			request.addListener("success", function(e) {
				this.setSchematext(request.getResponse());
			}, this);
			
			request.send();
		}
	},
	
	properties: {
		schematext: {
			check: "String"
		}
	}
})
