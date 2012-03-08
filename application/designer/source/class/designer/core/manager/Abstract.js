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
		tabView: {
			check: "designer.ui.tabview.TabView"
		},
		
		layoutPage: {
			check: "designer.ui.tabview.page.common.Layout",
			nullable : true,
			init : null
		},
		
		formPage: {
			check: "designer.ui.tabview.page.common.Form",
			nullable : true,
			init : null
		},
		
		functionsPage: {
			check: "designer.ui.tabview.page.Functions",
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
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
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
		* @param generateNewId {Boolean} If a new unique id should be generated. (default false)
		* @return {String} The objectId of the requested object.
		*/
		
		getObjectId: function(generatedId, generateNewId, prefix) {
			if (!prefix) { prefix = "object_"; }
			
			if (this._objects[generatedId].objectId) {
				return this._objects[generatedId].objectId
			} else {
				if (generateNewId === true) {
					var num = 1;
					while (this._objectIds[prefix + num] != undefined) {
						num++;
					}
					this.setObjectId(generatedId, prefix + num);
					return prefix + num;
				} else {
					return "";
				}
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
            this._objectIds[requestedId] = generatedId;
		},
		
		/**
		* Method for setting the class on a blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param objectClass {String} The string name of the object.
		*/
		setObjectClass: function(generatedId, objectClass) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
            
            this._objects[generatedId].objectClass = objectClass;
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
		* Gets the generatedId for an object component.
		*
		* @param generatedId {String} The id of the target object.
		* @param component {String} The name of the component.
		* @return {String|null} The component generatedId or null.
		*/
		
		getComponent: function(generatedId, component) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
			
			if (this._objectMeta[generatedId].components && qx.lang.Type.isString(this._objectMeta[generatedId].components[component])) {
				return this._objectMeta[generatedId].components[component]
			}
			
			return null;
		},
		
		/**
		* Sets a generatedId for an object component.
		*
		* @param generatedId {String} The id of the target object.
		* @param componentName {String} The name of the component.
		* @param componentGeneratedId {String} The generatedId of the component.
		* @return {void}
		*/
		
		setComponent: function(generatedId, componentName, componentGeneratedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "Requested generatedId object not found!");
			qx.core.Assert.assertObject(this._objects[componentGeneratedId], "Requested generatedId object not found!");
			
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
			var propDef = qx.Class.getPropertyDefinition(clazz, componentName);
			qx.core.Assert.assert(propDef !== null, "Component not found: " + componentName + " on class: " + clazz + " for " + generatedId);
			
			this._objectMeta[generatedId].components[componentName] = componentGeneratedId;
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
		* Method for clearing all events attached to a generatedId.
		*
		* @param generatedId {String} The id of the target object.
		* @return {void}
		*/
		
		clearAllEvents : function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			
			var events = this._objectMeta[this._rootGeneratedId].events;
			var objId = this._objects[generatedId].objectId;
			
			if (objId) {
				for (var i=0;i<events.length;i++) {
					if (this._objects[events[i]].sourceId == objId) {
						this.deleteDataObject(events[i]);
					}
				}
			}
		},
		
		/**
		* Method for clearing a class of events attached to a generatedId.
		*
		* @param generatedId {String} The id of the target object.
		* @param eventName {String} The string name of the event.
		* @return {void}
		*/
		
		clearEvents : function(generatedId, eventName) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			
			var events = this._objectMeta[this._rootGeneratedId].events;
			var objId = this._objects[generatedId].objectId;
			
			if (objId) {
				for (var i=0;i<events.length;i++) {
					if (this._objects[events[i]].sourceId == objId && this._objects[events[i]].eventName == eventName) {
						this.deleteDataObject(events[i]);
					}
				}
			}
		},
		
		/**
		* Method for getting an array of events with the generatedId as a source object.
		*
		* @param generatedId {String} The id of the target object.
		* @return {Array} An array of generatedIds for the matching events.
		*/
		getEvents : function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			
			var events = this._objectMeta[this._rootGeneratedId].events;
			var objId = this._objects[generatedId].objectId;
			var matches = [];
			
			if (objId) {
				for (var i=0;i<events.length;i++) {
					if (this._objects[events[i]].sourceId == objId) {
						matches.push(events[i]);
					}
				}
			}
			
			return matches;
		},
		
		/**
		* Method for getting a copy of an event with from a generatedId.
		*
		* @param generatedId {String} The id of the target object.
		* @return {Array} An array of generatedIds for the matching events.
		*/
		getEvent : function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assert(this._objectMeta[generatedId].location == "events", "generatedId: " + generatedId + " is not an event!");
			
			return blueprint.util.Misc.copyJson(this._objects[generatedId]);
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
			if (this._objectMeta[generatedId] && this._objectMeta[generatedId].qxTarget) {
				designer.core.manager.Selection.getInstance().setSelection(this._objectMeta[generatedId].qxTarget);
			} else {
				designer.core.manager.Selection.getInstance().clearSelection()
			}
		},
		
		showTab : function(tabName) {
			var tabview = this.getTabView();
			var children = tabview.getChildren();
			
			for (var i=0;i<children.length;i++) {
				if (tabName == children[i].getLabel()) {
					tabview.setSelection([children[i]]);
					break;
				}
			}
		}
	}
});
