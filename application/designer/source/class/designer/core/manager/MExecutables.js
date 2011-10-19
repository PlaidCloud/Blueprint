qx.Mixin.define("designer.core.manager.MExecutables",
{
	events: {
		executablesIndexed: "qx.event.type.Event"
	},
  	
  	members : {
		getFunctions : function() {
			var children = []
			for (var i in this._objectMeta[this._rootGeneratedId].functions) {
				children.push(this._objectMeta[this._rootGeneratedId].functions[i]);
			}
			return children;
		},
		
		getScripts : function() {
			var children = []
			for (var i in this._objectMeta[this._rootGeneratedId].scripts) {
				children.push(this._objectMeta[this._rootGeneratedId].scripts[i]);
			}
			return children;
		},
		
		getFunctionBody : function(generatedId) {
			qx.core.Assert.assertArray(this._objects[generatedId].code, "No code found in generatedId: " + generatedId);
			return qx.lang.Array.clone(this._objects[generatedId].code);
		},
		
		getScriptBody : function(generatedId) {
			qx.core.Assert.assertArray(this._objects[generatedId].code, "No code found in generatedId: " + generatedId);
			return qx.lang.Array.clone(this._objects[generatedId].code);
		},
		
		getFunctionName : function(generatedId) {
			for (var i in this._objectMeta[this._rootGeneratedId].functions) {
				if (this._objectMeta[this._rootGeneratedId].functions[i] == generatedId) { return i; }
			}
			throw new Error("generatedId: " + generatedId + " not found as a function.");
		},
		
		getScriptName : function(generatedId) {
			for (var i in this._objectMeta[this._rootGeneratedId].scripts) {
				if (this._objectMeta[this._rootGeneratedId].scripts[i] == generatedId) { return i; }
			}
			throw new Error("generatedId: " + generatedId + " not found as a function.");
		}
  	}
});