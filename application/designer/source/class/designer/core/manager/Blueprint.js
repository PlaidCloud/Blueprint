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
		loadJson : function() {
			var request = new qx.io.request.Xhr("resource/designer/examples/Login.json");

			request.addListener("success", function(e) {
				var obj = qx.lang.Json.parse(request.getResponse()).object;
				this._importTopContainer(obj);
			}, this);

			request.send();
		},
		
		exportJson : function() {
			// TODO make a better export
			//this.debug(qx.lang.Json.stringify(this._json, this._dereferenceDataObjects, '\t'));
		}
	}
});
