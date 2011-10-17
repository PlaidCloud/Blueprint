qx.Mixin.define("designer.core.manager.MForms",
{
	events: {
		formsIndexed: "qx.event.type.Event"
	},
  	
  	members : {
  		indexForms : function() {
  			this._formMeta = {};
			this._formUnassignedIds = [];
			
			for (var d=0;d<this._objectMeta[this._rootGeneratedId].data.complex.length;d++) {
				var generatedId = this._objectMeta[this._rootGeneratedId].data.complex[d];
				var obj = this._objects[generatedId];
				var clazz = qx.Class.getByName(obj.objectClass);
				
				if (qx.Class.isSubClassOf(clazz, qx.ui.form.Form)) {
					this.debug(">>> found form: " + obj.objectId);
					this._formMeta[generatedId] = {
						objectId: obj.objectId,
						elements: []
					};
				}
			}
			
			for (var o in this._objects) {
				var clazz = qx.Class.getByName(this._objects[o].objectClass);
				
				if (clazz && qx.Class.implementsInterface(clazz, qx.ui.form.IForm)) {
					var formObjectId = this._objects[o].qxSettings.blueprintForm;
					if (this._objectIds[formObjectId]) {
						this._formMeta[this._objectIds[formObjectId]].elements.push(o);
					} else {
						this._formUnassignedIds.push(o);
					}
				}
			}
			
			this.fireEvent("formsIndexed");
  		},
  		
		/**
		* Gets an array of form Ids. If called on a falsey value, the unassigned form
		* items are returned.
		*
		* @param generatedId {String} generatedId or null
		* @return {Array} The list of registered blueprint objects from the form.
		*/
		
		getFormObjects: function(generatedId) {
			if (generatedId) {
				qx.core.Assert.assertObject(this._formMeta[generatedId], "No form with the generatedId: " + generatedId + " exists!");
				var forms = [];
				for (var i=0;i<this._formMeta[generatedId].elements.length;i++) {
					forms.push(this._formMeta[generatedId].elements[i]);
				}
				
				return forms;
			} else {
				return blueprint.util.Misc.copyJson(this._formUnassignedIds);
			}
		},
  		
		/**
		* Gets an array of form Ids.
		*
		* @return {Array} The list of registered blueprint form generatedIds.
		*/
  		
		getForms : function() {
			if (this._formMeta) {
				return qx.lang.Object.getKeys(this._formMeta);
			} else {
				this.warn("getForms called before forms were indexed.");
				return [];
			}
		}
	}
});