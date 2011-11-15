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
			var def = "resource/designer/examples/";
			if (top.location.hash == "") {
				def += "Login.json";
			} else {
				def += top.location.hash.substring(1);
			}
			
			var request = new qx.io.request.Xhr(def);

			request.addListener("success", function(e) {
				var that=this;
				designer.util.Schema.getInstance().runWhenReady(function() {
					try {
						var obj = designer.util.JsonError.validate(request.getResponse()).object;
					} catch (e) {
						designer.util.Misc.plaidAlert("Unable to load Json document. Most likely it doesn't fit the schema.");
					}
					that.importTopContainer(obj);
				})
			}, this);

			request.send();
		},
		
		exportJson : function() {
			return this._exportJson();
		}
	}
});
