qx.Class.define("designer.core.manager.Abstract", {
	extend: qx.core.Object,
	include: [
	designer.core.manager.MCreation,
	designer.core.manager.MFunctions,
	designer.core.manager.MForms,
	designer.core.manager.MIndexing,
	designer.core.manager.MOrdering,
    designer.core.manager.MPalette
	],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/
	
	/**
	* The abstract manager constructor.
	*/

	construct: function() {
		this.base(arguments);
	},
	
	properties: {
		layoutPage: {
			check: "designer.ui.tabview.page.Layout",
			nullable : true,
			init : null
		},
		
		formPage: {
			check: "designer.ui.tabview.page.common.Form",
			nullable : true,
			init : null
		},
		
		functionsPage: {
			check: "designer.ui.tabview.page.Scripts",
			nullable : true,
			init : null
		},
		
		jsonPage: {
			check: "designer.ui.tabview.page.Json",
			nullable : true,
			init : null
		}
	},

	events: {
	
	},

	statics: {
	
	},

	members: {
		/**
		* Get a prefixed class name.
		*
		* @param objectClass {String} The namespace to apply the prefix to.
		* @return {String} The classname with the prefix applied to the beginning.
		*/
		
		getClass: function(objectClass) {
			if (this._placeHolders[objectClass]) {
				return qx.Class.getByName(this._placeHolders[objectClass]);
			}
		
			var namespace = objectClass.slice(0, objectClass.indexOf('.'));
		
			qx.core.Assert.assertString(this._prefixes[namespace], "Namespace: " + namespace + " for requested object was not registered.");
			
			return qx.Class.getByName(this._prefixes[namespace] + "." + objectClass);
		},
		
		/**
		* Method for getting a copy of the value of a property currently stored in the
		* blueprint json.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @return {var} A copy of the requested property.
		*/
		
		getConstructorSetting: function(generatedId, constructorSetting) {
			var cSetting = blueprint.util.Misc.getDeepKey(this._objects[generatedId], ["constructorSettings", constructorSetting]);
			
			if (cSetting) { return blueprint.util.Misc.copyJson(cSetting); } else { return null; }
		},
		
		/**
		* Method for getting the objectClass from a generatedId.
		*
		* @param generatedId {String} The id of the target object.
		* @return {String} The objectClass string.
		*/
		getObjectClass: function(generatedId) {
			return this._objects[generatedId].objectClass;
		},
		
		/**
		* Method for getting the children of an object.
		* @param generatedId {String} The id of the target object.
		* @return {Array} A list of the generatedIds of any child objects.
		*/
		getObjectContents: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " does not exist in the manager!");
			if (generatedId == this._rootGeneratedId) {
				return [this._objectMeta[generatedId].layout];
			} else if (this._objectMeta[generatedId].contents) {
				return qx.lang.Array.clone(this._objectMeta[generatedId].contents);
			} else {
				return [];
			}
		},
		
		/**
		* Method for getting an objectId from a generatedId
		*
		* @param generatedId {String} The id of the target object.
		* @return {String} The objectId of the requested object.
		*/
		
		getObjectId: function(generatedId) {
			if (this._objects[generatedId].objectId) {
				return this._objects[generatedId].objectId
			} else {
				return ""
			}
		},
		
		/**
		* Method for getting the properties from a generatedId.
		*
		* @param generatedId {String} The id of the target object.
		* @return {Array} A list of the acceptable object properties.
		*/
		getObjectProperties: function(generatedId) {
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
		
			return qx.Class.getProperties(clazz);
		},
		
		/**
		* Method for getting the properties from an objectClass.
		*
		* @param generatedId {String} The id of the target object.
		* @return {Array} A list of the acceptable object properties.
		*/
		getObjectPropertyDefinition: function(generatedId, propertyName) {
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
			var propDef = qx.Class.getPropertyDefinition(clazz, propertyName);
		
			return propDef;
		},
		
		/**
		* Method for getting a copy of the value of a property currently stored in the
		* blueprint json.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @return {var} A copy of the requested property.
		* Returns the property definition init value if no value is set.
		*/
		
		getProperty: function(generatedId, propertyName) {
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
			var propDef = qx.Class.getPropertyDefinition(clazz, propertyName);
			qx.core.Assert.assert(propDef !== null, "Property not found.");
		
			var obj = this._objects[generatedId];
		
			if (obj.qxSettings[propertyName] !== undefined) {
				return blueprint.util.Misc.copyJson(obj.qxSettings[propertyName]);
			}
		
			return propDef.init;
		},
		
		/**
		* Method for setting an objectId on a generatedId
		*
		* @param generatedId {String} The id of the target object.
		* @param objectId {String} The id of the target object.
		* @return {void}
		*/
		
		/**
		* Method for setting a constructorSetting on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param constructorSetting {String} The name of the constructor setting to be set.
		* @param value {String} The new value to be set.
		*/
		setConstructorSetting: function(generatedId, constructorSetting, value) {
			// TODO: Check if csetting is supported
			// var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
			// var constructorSettingDef = someCsettingMethod(clazz, propertyName);
			// qx.core.Assert.assert(propDef !== null, "Property not found.");
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
			this._objects[generatedId].constructorSettings[constructorSetting] = blueprint.util.Misc.copyJson(value);
		},
		
		/**
		* Method for setting a constructorSetting on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param constructorSetting {String} The name of the setting to be deleted.
		*/
		deleteConstructorSetting : function(generatedId, constructorSetting) {
			delete(this._objects[generatedId].constructorSettings[constructorSetting]);
		},
		
		setObjectId: function(generatedId, requestedId) {
			qx.core.Assert.assertUndefined(this._objectIds[requestedId], "Requested objectId: " + requestedId + " already exists!");
			
            var validIds = requestedId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            
            qx.core.Assert.assertArray(validIds, "requestedId was not a valid objectId! (No match found.)");
            qx.core.Assert.assert(validIds.length == 1, "requestedId was not a valid objectId! (Multiple matches found.)");
            qx.core.Assert.assert(validIds[0] == requestedId, "requestedId was not a valid objectId! (Invalid match.)");
            
            this._objects[generatedId].objectId = requestedId;
		},
		
		/**
		* Method for setting the layout properties on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param layoutmap {Object} The name of the property to set.
		* @return {void}
		*/
		
		setLayoutProperties: function(generatedId, layoutmap) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
			this._objectMeta[generatedId].layoutmap = layoutmap;
			
			this._objectMeta[generatedId].qxTarget.setLayoutProperties(layoutmap);
		},
		
		/**
		* Method for getting the layout properties on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @return {Object} The layout mapping
		*/
		
		getLayoutProperties: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
						
			if (this._objectMeta[generatedId].layoutmap) {
				return blueprint.util.Misc.copyJson(this._objectMeta[generatedId].layoutmap);
			} else {
				return {};
			}
		},
		
		/**
		* Method for checking if an object has a particular component defined.
		*
		* @param generatedId {String} The id of the target object.
		* @param component {String} The name of the component.
		* @return {String|null} The component generatedId or null.
		*/
		
		getComponent: function(generatedId, component) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
			
			if (qx.lang.Type.isObject(this._objectMeta[component])) {
				return this._objectMeta[component];
			}
			
			return null;
		},
		
		/**
		* Method for setting a property on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @param value {var} The new value to be set.
		* @param clear {Boolean} If true, delete the property from the json map (ignores the value argument).
		* @return {void}
		*/
		
		setProperty: function(generatedId, propertyName, value, clear) {
			//qx.core.Assert.assert(!qx.lang.Array.contains(this._propertyBlackList, propertyName), "Property: " + propertyName + " is in the property blacklist!");
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
		
			var propDef = qx.Class.getPropertyDefinition(clazz, propertyName);
			qx.core.Assert.assert(propDef !== null, "Property not found: " + propertyName + " on class: " + clazz + " for " + generatedId);
			
			if (value != propDef.init && !clear) {
				this._objects[generatedId].qxSettings[propertyName] = blueprint.util.Misc.copyJson(value);
			} else {
				delete(this._objects[generatedId].qxSettings[propertyName]);
			}
			
			if (this._objectMeta[generatedId].qxTarget) {
				if (qx.lang.Type.isFunction(this._objectMeta[generatedId].qxTarget.jsonChanged)) {
					this._objectMeta[generatedId].qxTarget.jsonChanged(propertyName, value);
				} else {
					this.debug("jsonChanged function not found on: " + this._objectMeta[generatedId].qxTarget + " for " + propertyName + ":" + value + "/" + clear);
					try {
						this._objectMeta[generatedId].qxTarget.set(propertyName, value);
					} catch(e) {
						this.warn("Direct set failed: " + e);
					}
				}
			}
		},
		
		/**
		* Method for getting the generatedId of the current selection in the layout pane
		* @return {String || null}
		*/
		
		getSelection : function() {
			try {
				return designer.core.manager.Selection.getInstance().getSelection().getGeneratedId();
			} catch(e) {
				return null;
			}
		},
		
		/**
		* Method for setting the selection in the layout pane
		* @param generatedId {String} The id of the target object.
		* @return {void}
		*/
		setSelection : function(generatedId) {
		    qx.core.Assert.assertObject(this._objectMeta[generatedId].qxTarget, "generatedId: " + generatedId + " does not have an object associated with it in the design json!");
			designer.core.manager.Selection.getInstance().setSelection(this._objectMeta[generatedId].qxTarget);
		}
	}
});
