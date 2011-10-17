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
				try {
					var obj = designer.util.JsonError.validate(request.getResponse()).object;
				} catch (e) {
					throw ("Invalid Json document.");
				}
				this.importTopContainer(obj);
			}, this);

			request.send();
		},
		
		exportJson : function() {
			return this._exportJson();
		}
	}
});
