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