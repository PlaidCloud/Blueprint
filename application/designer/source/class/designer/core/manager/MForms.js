qx.Mixin.define("designer.core.manager.MForms",
{
	events: {
		formsIndexed: "qx.event.type.Event"
	},
  	
  	members : {
		/**
		* Deletes a form with the specified generatedId.
		*
		* @param generatedId {String} generatedId
		* @return {void}
		*/
  		deleteForm : function(generatedId) {
			qx.core.Assert.assertObject(this._formMeta[generatedId], "No form with the generatedId: " + generatedId + " exists!");
			
			for (var i=0;i<this._formMeta[generatedId].elements.length;i++) {
				var elm = this._formMeta[generatedId].elements[i];
				blueprint.util.Misc.setDeepKey(this._objects[elm], ["qxSettings", "blueprintForm"], "");
				
				this._formUnassignedIds.push(elm);
			}
			this._formMeta[generatedId].elements = [];
			
			qx.lang.Array.remove(this._objectMeta[this._rootGeneratedId].data.complex, generatedId);
			delete(this._objects[generatedId]);
			
			this.indexForms();
  		},
  		
		/**
		* Indexes the form elements. Must be called after any changes to forms or elements.
		*
		* @return {void}
		*/
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
		},
		
		/**
		* Moves an object into a form, deleting any previous form memberships.
		*
		* @param objectGeneratedId {String} The object being moved.
		* @param formGeneratedId {String} The form the object is being moved to.
		* @return {void}
		*/

		moveFormObject : function(objectGeneratedId, formGeneratedId) {
			qx.core.Assert.assertObject(this._objects[objectGeneratedId], "objectGeneratedId: " + objectGeneratedId + " could not be found.");
			
			var oldFormObjectId = blueprint.util.Misc.getDeepKey(this._objects[objectGeneratedId], ["qxSettings", "blueprintForm"]);
			var oldFormGeneratedId;
			if (oldFormObjectId) {
				oldFormGeneratedId = this._objectIds[oldFormObjectId];
			}
			
			if (oldFormGeneratedId) {
				qx.core.Assert.assertString(qx.lang.Array.remove(this._formMeta[oldFormGeneratedId].elements, objectGeneratedId), oldFormGeneratedId + " not found in expected form array!");
			} else {
				qx.core.Assert.assertString(qx.lang.Array.remove(this._formUnassignedIds, objectGeneratedId), oldFormGeneratedId + " not found in unassigned form array!");
			}
			
			if (formGeneratedId) {
				qx.core.Assert.assertObject(this._objects[formGeneratedId], "formGeneratedId: " + formGeneratedId + " could not be found.");
				qx.core.Assert.assertObject(this._formMeta[formGeneratedId], "formGeneratedId: " + formGeneratedId + " is not registered as a form.");
				qx.core.Assert.assertString(this._objects[formGeneratedId].objectId, "formGeneratedId: " + formGeneratedId + " does not have an objectId.");
				
				this._formMeta[formGeneratedId].elements.push(objectGeneratedId);
				blueprint.util.Misc.setDeepKey(this._objects[objectGeneratedId], ["qxSettings", "blueprintForm"], this._objects[formGeneratedId].objectId);
			} else {
				this._formUnassignedIds.push(objectGeneratedId);
				blueprint.util.Misc.setDeepKey(this._objects[objectGeneratedId], ["qxSettings", "blueprintForm"], "");
			}
			
			this.indexForms();
		}
	}
});