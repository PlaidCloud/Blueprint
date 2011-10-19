qx.Mixin.define("designer.core.manager.MExecutables",
{
	events: {
		executablesIndexed: "qx.event.type.Event"
	},
  	
  	members : {
		getScripts : function() {
			return qx.lang.Array.clone(this._objectMeta[this._rootGeneratedId].scripts);
		},
		
		getFunctions : function() {
			return qx.lang.Array.clone(this._objectMeta[this._rootGeneratedId].functions);
		}
  	}
});