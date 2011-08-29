qx.Class.define("designer.core.manager.Blueprint",
{
	extend : designer.core.manager.Abstract,
	type : "singleton",
	
	construct : function() {
		this.base(arguments);
	},
	
	members :
	{
		/**
		* TODOC
		*
		* @return {void} 
		*/
		loadJson : function()
		{
			var request = new qx.io.remote.Request("resource/designer/examples/Login2.json");
			
			request.addListener("completed", this._processJson, this);
			
			request.send();
		},
		
		exportJson : function() {
			for (var i in this._objects) {
				delete(this._objects[i]['__designer']);
			}
			
			this.debug(qx.lang.Json.stringify(this._json, null, '\t'));
		}
	}
});
