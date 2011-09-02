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
		* Creates a form with the string name passed in.
		*
		* @param formName {String} The name of the new form.
		* @return {void}
		*/
		
		createForm: function(formName) {
			qx.core.Assert.assertUndefined(this._objectIds[formName], "New form name must be an unused objectId");
			qx.core.Assert.assertUndefined(this._objectIds[formName + "controller"], "New form name must be an unused objectId");
			
			var dataJson = {
				"objectClass": "blueprint.data.Form", 
				"objectId": formName
            };
			
			var controllerJson = {
				"constructorSettings": {
					"model": formName
				}, 
				"objectClass": "blueprint.data.controller.Form", 
				"objectId": formName + "_formController"
            };
            
            this._createFormWorker(dataJson, controllerJson);
		},
		
		createButton: function() {
			var buttonJson = {
				"objectClass": "blueprint.ui.form.Button", 
				"objectId": "newGuyNumbaOne",
				"qxSettings": {
					"label": "New Button"
				}
            };
			
			var layoutmap = {
				"top": 5,
				"left": 5
            };
            
	        var selectedObject = designer.core.manager.Selection.getInstance().getSelection().getGeneratedId();
            
    	    if (selectedObject) {
        	    this._createLayoutObjectWorker(buttonJson, null, selectedObject);
            }
		},
		
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
			this.debug(qx.lang.Json.stringify(this._json, this._dereferenceDataObjects, '\t'));
		}
	}
});
