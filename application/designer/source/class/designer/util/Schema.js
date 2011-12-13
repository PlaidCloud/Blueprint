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
		_runQueue: null,
		_paths: {
			"blueprint": "/TartanBlueprint/framework/blueprint/blueprint.schema.json",
			//"plaid": "resource/builder/plaid.schema.json"
			"plaid": "/client/plaid/plaid.schema.json"
		},
		init: function(whichone) {
			//DONE: change this to be different between designer and plaid
			
			var request = new qx.io.request.Xhr(this._paths[whichone]);
		
			request.addListener("success", function(e) {
				this.setSchematext(request.getResponse());
				this.readyRun();
			}, this);
			
			request.send();
		},
		runWhenReady: function(proc){
			if (this.getSchematext()) {
				proc();
			} else if (!this._runQueue) {
				this._runQueue = [proc];
			} else {
				this._runQueue.push(proc);
			}
		},
		readyRun: function() {
			if (this._runQueue) {
				for (var i=0; i<this._runQueue.length; i++) {
					var proc = this._runQueue[i];
					proc();
				}
			}
		}
	},
	
	properties: {
		schematext: {
			check: "String",
			nullable: true,
			init: null
		}
	}
})
