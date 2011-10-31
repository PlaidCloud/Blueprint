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
			throw new Error("generatedId: " + generatedId + " not found as a script.");
		},
		
		setFunctionName : function(generatedId, key) {
			for (var i in this._objectMeta[this._rootGeneratedId].functions) {
				if (this._objectMeta[this._rootGeneratedId].functions[i] == generatedId) {
					this._objectMeta[this._rootGeneratedId].functions[key] = generatedId;
					this._objectMeta[generatedId].metaKey = "functions." + key;
					
					delete(this._objectMeta[this._rootGeneratedId].functions[i]);
					return;
				}
			}
			throw new Error("generatedId: " + generatedId + " not found as a function.");
		},
		
		setScriptName : function(generatedId, key) {
			for (var i in this._objectMeta[this._rootGeneratedId].scripts) {
				if (this._objectMeta[this._rootGeneratedId].scripts[i] == generatedId) {
					this._objectMeta[this._rootGeneratedId].scripts[key] = generatedId;
					this._objectMeta[generatedId].metaKey = "scripts." + key;
					
					delete(this._objectMeta[this._rootGeneratedId].scripts[i]);
					return;
				}
			}
			throw new Error("generatedId: " + generatedId + " not found as a script.");
		},
		
		setFunctionBody : function(generatedId, code) {
			qx.core.Assert.assertArray(code, "Code must be an array of strings.");
			this._objects[generatedId].code = code;
		},
		
		setScriptBody : function(generatedId, code) {
			qx.core.Assert.assertArray(code, "Code must be an array of strings.");
			this._objects[generatedId].code = code
		}
  	}
});