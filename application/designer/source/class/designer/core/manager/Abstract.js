qx.Class.define("designer.core.manager.Abstract", {
	extend: qx.core.Object,
	include: [
	designer.core.manager.MIndexing,
	designer.core.manager.MForms
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
			check: "designer.ui.LayoutPage"
		}
	},

	events: {
	
	},

	statics: {
	
	},

	members: {
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
		* Get a prefixed class name.
		*
		* @param objectClass {String} The namespace to apply the prefix to.
		* @return {String} The classname with the prefix applied to the beginning.
		*/
		
		getClass: function(objectClass) {
			if (this.__placeHolders[objectClass]) {
				return qx.Class.getByName(this.__placeHolders[objectClass]);
			}
		
			var namespace = objectClass.slice(0, objectClass.indexOf('.'));
		
			qx.core.Assert.assertString(this.__prefixes[namespace], "Namespace: " + namespace + " for requested object was not registered.");
		
			return qx.Class.getByName(this.__prefixes[namespace] + "." + objectClass);
		},
		
		/**
		* Method for getting the children of an object.
		* @param generatedId {String} The id of the target object.
		* @return {Array} A list of the generatedIds of any child objects.
		*/
		getObjectContents: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " does not exist in the manager!");
			if (this._objectMeta[generatedId].contents) {
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
		* Method for setting an objectId on a generatedId
		*
		* @param generatedId {String} The id of the target object.
		* @param objectId {String} The id of the target object.
		* @return {void}
		*/
		
		setObjectId: function(generatedId, requestedId) {
			qx.core.Assert.assertUndefined(this._objectIds[requestedId], "Requested objectId: " + requestedId + " already exists!");
			
            var validIds = requestedId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            
            qx.core.Assert.assertArray(validIds, "requestedId was not a valid objectId! (No match found.)");
            qx.core.Assert.assert(validIds.length == 1, "requestedId was not a valid objectId! (Multiple matches found.)");
            qx.core.Assert.assert(validIds[0] == requestedId, "requestedId was not a valid objectId! (Invalid match.)");
            
            this._objects[generatedId].objectId = requestedId;
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
		* Method for setting the selection in the layout pane
		* @param generatedId {String} The id of the target object.
		* @return {void}
		*/
		setSelection : function(generatedId) {
		    qx.core.Assert.assertObject(this._objectMeta[generatedId].object, "generatedId: " + generatedId + " does not have an object associated with it in the design json!");
			designer.core.manager.Selection.getInstance().setSelection(this._objectMeta[generatedId].object);
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
		}
	}
});
