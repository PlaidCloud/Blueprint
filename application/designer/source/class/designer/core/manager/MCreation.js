qx.Mixin.define("designer.core.manager.MCreation",
{

	events : {
		/**
		* Fired when some element in the layout json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		layoutUpdate: "qx.event.type.Data"
	},
	
  	members : {
		/**
		* Worker function to create a new data object.
		*
		* @param obj {blueprint.data.Form} The new object.
		* @param parentId {String} The generatedId for the parent.
		* @return {void}
		*/
		
		createDataObject: function(obj, parentId) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			
		},

		/**
		* Function to create a new layout object.
		*
		* @param layoutObject {blueprint.data.Form} The new object.
		* @param parentId {String} The generatedId for the parent.
		* @param layoutmap {Object} The layout map for the new object (if necessary.)
		* @return {void}
		*/
		
		createLayoutObject: function(layoutObject, parentId, layoutmap) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			
			var parent = this._objectMeta[parentId].qxTarget;
			qx.core.Assert.assertFunction(parent.add, "Specified parent does not support an add method.");
			qx.core.Assert.assertFunction(parent.getLayout, "Specified parent does not support the getLayout method.");
			
			if (!layoutmap) {
				layoutmap = this._getPossibleLayoutMap(parentId);
			}
			
			/*
			
			var parentJson = this._objects[parentId];
			
			if (!qx.lang.Type.isArray(parentJson.contents)) {
				parent.contents = [];
			}
			
			this.__processJsonLayoutWorker(blueprint.util.Misc.copyJson(layoutObject), layoutmap, parentId);
			
			*/
			
			this.fireEvent("layoutUpdate");
		},

		/**
		* Function to create a new form from json objects.
		*
		* @param formName {String} The objectId for the new form. Must be unique in the namespace.
		* (Also, formName + '_formController' must not be used.)
		* controller object.
		* @return {void}
		*/
		
		createForm: function(formName) {
			qx.core.Assert.assertUndefined(this._objectIds[formName], "New form name must be an unused objectId");
			qx.core.Assert.assertUndefined(this._objectIds[formName + "_formController"], "New form name must be an unused objectId");
			
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
			
			qx.core.Assert.assertArray(this._json.data.complex, "this._json has no complex data object array!");
			qx.core.Assert.assertArray(this._json.controllers, "this._json has no controllers object array!");
			/*
			this._json.data.complex.push(dataJson);
			this._json.controllers.push(controllerJson);
			
			var formGeneratedId = this._registerDataObject(dataJson, this.__rootGeneratedId, this._json.data.complex, (this._json.data.complex.length - 1));
			this._registerDataObject(controllerJson, this.__rootGeneratedId, this._json.controllers, (this._json.controllers.length - 1));
			
			qx.core.Assert.assertString(formGeneratedId, "New form must have a generatedId to be added to _formGeneratedIds");
			this._formGeneratedIds[formGeneratedId] = [];
			*/
		}
	}
});