qx.Class.define("designer.core.manager.AbstractOld", {
	extend: qx.core.Object,

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
		
		this.__objectCounter = 0;
		this.__prefixes = {};
		this.__placeHolders = {};
		this.__rootGeneratedId = null;
		
		this._json = null;
		
		this._objects = {};
		this._objectIds = {};
		this._objectMeta = {};
		
		this._formGeneratedIds = {};
		this._formObjectIds = {};
		this._formUnassignedIds = [];
		
		this._objectIdReferenceSources = {};
		
		this._propertyBlackList = [];
		
		
		// All blueprint objects are defined with designer.blueprint.*
		this.registerObjectPrefix({
			"blueprint": "designer"
		});
		this.registerObjectPlaceHolder({
			"blueprint.ui.window.Window": "designer.placeholder.Window"
		});
		
		this._propertyBlackList.push("blueprintForm");
	},

	/*
  *****************************************************************************
	 EVENTS
  *****************************************************************************
  */

	events: {
		/**
		* Fired after json is successfully loaded from a source.
		*/
		jsonLoaded: "qx.event.type.Event",

		/**
		* Fired when the json is successfully exported and saved to a source.
		*/
		jsonSaved: "qx.event.type.Event",

		/**
		* Fired when some element in the bindings json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		bindingsUpdate: "qx.event.type.Data",

		/**
		* Fired when some element in the controllers json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		controllersUpdate: "qx.event.type.Data",
		
		/**
		* Fired when some element in the data json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		dataUpdate: "qx.event.type.Data",
		
		/**
		* Fired when some element in the events json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		eventsUpdate: "qx.event.type.Data",
		
		/**
		* Fired when some element in the functions json has changed.
		*/
		functionsUpdate: "qx.event.type.Event",
		
		/**
		* Fired when some element in the layout json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		layoutUpdate: "qx.event.type.Data",
		
		/**
		* Fired when some element in the scripts json has changed.
		*/
		scriptsUpdate: "qx.event.type.Event"
	},

	properties: {
		layoutPage: {
			check: "designer.ui.LayoutPage"
		}
	},

	statics: {
		__TOP_CONTAINER_OBJECTS: ["layout", "data", "scripts", "functions"],
		__TOP_CONTAINER_ARRAYS: ["controllers", "bindings", "events"],

		__checks: {
			"Boolean": qx.core.Assert.assertBoolean,
			"String": qx.core.Assert.assertString,

			"Number": qx.core.Assert.assertNumber,
			"Integer": qx.core.Assert.assertInteger,
			"PositiveNumber": qx.core.Assert.assertPositiveNumber,
			"PositiveInteger": qx.core.Assert.assertPositiveInteger,

			"Object": qx.core.Assert.assertObject,
			"Array": qx.core.Assert.assertArray
		}
	},

	members: {
		__objectCounter: null,
		__rootGeneratedId: null,
		__prefixes: null,
		__placeHolders: null,
		_propertyBlackList: null,
		_json: null,
		_objects: null,
		_objectIds: null,
		_objectMeta: null,
		_objectIdReferenceSources: null,
		_formObjectIds: null,
		_formGeneratedIds: null,
		_formUnassignedIds : null,

		/**
		* Function to provide a possible target in a layout.
		*
		* @param parentId {String} The generatedId for the parent.
		* @return {Object || null} A possible layout map for the parent.
		*/

		_getPossibleLayoutMap : function(parentId) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			
			var parent = this._objectMeta[parentId].object;
			qx.core.Assert.assertFunction(parent.add, "Specified parent does not support an add method.");
			qx.core.Assert.assertFunction(parent.getLayout, "Specified parent does not support the getLayout method.");
			
			var layout;
			
			switch(parent.getLayout().classname) {
				case "qx.ui.layout.Canvas":
				layout = {
					top: 5,
					left: 5
				};
				break;
				
				case "qx.ui.layout.Dock":
				var targets = ["center", "north", "east", "south", "west"];
				var children = parent.getChildren();
				for (var i=0;i<children.length;i++) {
					qx.lang.Array.remove(targets, children[i].getLayoutProperties().edge);
				}
				qx.core.Assert.assert(targets.length > 0, "All possible targets used for this canvas layout!");
				
				layout = {
					edge: targets[0]
				};
				break;
			}
			
			return layout;
			
		},
		
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
			
			var parent = this._objectMeta[parentId].object;
			qx.core.Assert.assertFunction(parent.add, "Specified parent does not support an add method.");
			qx.core.Assert.assertFunction(parent.getLayout, "Specified parent does not support the getLayout method.");
			
			if (!layoutmap) {
				layoutmap = this._getPossibleLayoutMap(parentId);
			}
			
			var parentJson = this._objects[parentId];
			
			if (!qx.lang.Type.isArray(parentJson.contents)) {
				parent.contents = [];
			}
			
			this.__processJsonLayoutWorker(blueprint.util.Misc.copyJson(layoutObject), layoutmap, parentId);
			
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
			
			this._json.data.complex.push(dataJson);
			this._json.controllers.push(controllerJson);
			
			var formGeneratedId = this._registerDataObject(dataJson, this.__rootGeneratedId, this._json.data.complex, (this._json.data.complex.length - 1));
			this._registerDataObject(controllerJson, this.__rootGeneratedId, this._json.controllers, (this._json.controllers.length - 1));
			
			qx.core.Assert.assertString(formGeneratedId, "New form must have a generatedId to be added to _formGeneratedIds");
			this._formGeneratedIds[formGeneratedId] = [];
		},

		/**
		* Register a new prefix for a namespace. For example, registering 'designer.' as
		* as prefix for all objects in the 'blueprint.*' namespace.
		*
		* @param obj {String || Object} The string objectClass or an Object containing
		* a map of key value pairs.
		* @param placeholder {String} The string class name for the placeholder.
		* @return {void}
		*/
		
		registerObjectPlaceHolder: function(clazz, placeholder) {
			if (qx.lang.Type.isObject(clazz)) {
				for (var n in clazz) {
					this.registerObjectPlaceHolder(n, clazz[n]);
				}
			} else {
				qx.core.Assert.assertString(clazz, "clazz must be a string");
				qx.core.Assert.assertString(placeholder, "Placeholder must be a string");
				this.__placeHolders[clazz] = placeholder;
			}
		},
		
		/**
		* Register a new prefix for a namespace. For example, registering 'designer.' as
		* as prefix for all objects in the 'blueprint.*' namespace.
		*
		* @param namespace {String} The namespace to apply the prefix to or an Object containing
		* a map of key value pairs.
		* @param prefix {String} The string name prefix to be applied to new objects.
		* @return {void}
		*/
		
		registerObjectPrefix: function(namespace, prefix) {
			if (qx.lang.Type.isObject(namespace)) {
				for (var n in namespace) {
					this.registerObjectPrefix(n, namespace[n]);
				}
			} else {
				qx.core.Assert.assertString(namespace, "Namespace must be a string");
				qx.core.Assert.assertString(prefix, "Prefix must be a string");
				this.__prefixes[namespace] = prefix;
			}
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
		* Gets an array of form Ids.
		*
		* @return {Array} The list of registered blueprint form generatedIds.
		*/
		
		getForms: function() {
			return qx.lang.Object.getKeys(this._formGeneratedIds);
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
				qx.core.Assert.assertArray(this._formGeneratedIds[generatedId], "No form with the generatedId: " + generatedId + " exists!");
				return blueprint.util.Misc.copyJson(this._formGeneratedIds[generatedId]);
			} else {
				return blueprint.util.Misc.copyJson(this._formUnassignedIds);
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
				qx.core.Assert.assertString(qx.lang.Array.remove(this._formGeneratedIds[oldFormGeneratedId], objectGeneratedId), oldFormGeneratedId + " not found in expected form array!");
			} else {
				qx.core.Assert.assertString(qx.lang.Array.remove(this._formUnassignedIds, objectGeneratedId), oldFormGeneratedId + " not found in unassigned form array!");
			}
			
			if (formGeneratedId) {
				qx.core.Assert.assertObject(this._objects[formGeneratedId], "formGeneratedId: " + formGeneratedId + " could not be found.");
				qx.core.Assert.assertArray(this._formGeneratedIds[formGeneratedId], "formGeneratedId: " + formGeneratedId + " is not registered as a form.");
				qx.core.Assert.assertString(this._objects[formGeneratedId].objectId, "formGeneratedId: " + formGeneratedId + " does not have an objectId.");
				
				this._formGeneratedIds[formGeneratedId].push(objectGeneratedId);
				var newForm = this._objects[formGeneratedId].objectId;
				blueprint.util.Misc.setDeepKey(this._objects[objectGeneratedId], ["qxSettings", "blueprintForm"], newForm);
			} else {
				this._formUnassignedIds.push(objectGeneratedId);
				blueprint.util.Misc.setDeepKey(this._objects[objectGeneratedId], ["qxSettings", "blueprintForm"], "");
			}
			
			this.fireEvent("dataUpdate");
			this.fireEvent("layoutUpdate");
		},
		
		/**
		* Generate a new object and place it into a parent
		*
		* @param generatedId {String} The id of the target class.
		* @param options {Object} The vData constructor object to be passed into the new object.
		* @param parentId {String} The id of the parent object.
		* @return {void}
		*/
		_generateLayoutObject: function(generatedId, vData, parentId) {
			this.debug("Calling _generateLayoutObject with " + generatedId + ", " + parentId);
			var objectClass = this._objects[generatedId].objectClass;
			var parent, layoutmap;
			if (parentId === this.__rootGeneratedId) {
				// This is a top level object; add it directly to the layout page.
				parent = this.getLayoutPage();
				layoutmap = {
					top: 1,
					left: 1
				};
			} else {
				qx.core.Assert.assertObject(this._objects[parentId], "Parent object must exist in the object registry.");
				parent = this._objectMeta[parentId].object
				layoutmap = this._objectMeta[generatedId].layoutmap
			}
		
			var clazz = this.getClass(objectClass);
			this.debug("about to build: " + objectClass + " // " + clazz);
		
			//TODO - only pass in a copy of the relevant json
			
			if (!vData.constructorSettings) { vData.constructorSettings = {}; }
			if (!vData.qxSettings) { vData.qxSettings = {}; }
			
			var newObject = new clazz(vData, "designer", true);
			
			this._objectMeta[generatedId].object = newObject;
		
			newObject.setGeneratedId(generatedId);
			
			parent.layoutAdd(newObject, layoutmap);
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
		* Method for setting the selection in the layout pane
		* @param generatedId {String} The id of the target object.
		* @return {void}
		*/
		setSelection : function(generatedId) {
		    qx.core.Assert.assertObject(this._objectMeta[generatedId].object, "generatedId: " + generatedId + " does not have an object associated with it in the design json!");
			designer.core.manager.Selection.getInstance().setSelection(this._objectMeta[generatedId].object);
		},
		
		/**
		* Method for getting the root layout object.
		* @return {String} The generated id of the root layout object
		*/
		getRootLayoutObject: function() {
			qx.core.Assert.assertString(this.__rootGeneratedId, "No json is loaded!");
			return this.__rootGeneratedId;
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
		* Method for setting a property on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @param value {String} The new value to be set.
		* @return {Number} Returns 0 if successful.
		*/
		
		setProperty: function(generatedId, propertyName, value) {
			qx.core.Assert.assert(!qx.lang.Array.contains(this._propertyBlackList, propertyName), "Property: " + propertyName + " is in the property blacklist!");
			var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
		
			var propDef = qx.Class.getPropertyDefinition(clazz, propertyName);
			qx.core.Assert.assert(propDef !== null, "Property not found.");
		
			if (propDef.check) {
				if (qx.lang.Type.isFunction(designer.core.manager.Abstract.__checks[propDef.check])) {
					designer.core.manager.Abstract.__checks[propDef.check](value, "Value: " + value + " does not match type: " + propDef.check);
				}
			}
		
			if (value != propDef.init) {
				this._objects[generatedId].qxSettings[propertyName] = blueprint.util.Misc.copyJson(value);
			} else {
				delete(this._objects[generatedId].qxSettings[propertyName]);
			}
		
			if (qx.lang.Type.isFunction(this._objectMeta[generatedId].object.jsonChanged)) {
				this._objectMeta[generatedId].object.jsonChanged(propertyName, value);
			} else {
				this.warn("jsonChanged function not found on: " + this._objectMeta[generatedId].object);
			}
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
		* Method for setting a constructorSetting on a generated blueprint object.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @param value {String} The new value to be set.
		* @return {Number} Returns 0 if successful.
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
		* Method for getting a copy of the value of a property currently stored in the
		* blueprint json.
		*
		* @param generatedId {String} The id of the target object.
		* @param propertyName {String} The name of the property to set.
		* @return {var} A copy of the requested property.
		*/
		
		getConstructorSetting: function(generatedId, constructorSetting) {
			var cSetting = blueprint.util.Misc.getDeepKey(this._objects[generatedId], ["constructorSettings", constructorSetting]);
		
			return blueprint.util.Misc.copyJson(cSetting);
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
		* Protected method for registering a new json object.
		*
		* @param generatedId {String} The string generatedId.
		* @param json {Object} The object to be registered.
		* @return {void} 
		*/
		_registerJson: function(generatedId, json) {
			qx.core.Assert.assertUndefined(this._objects[generatedId], "generatedId: " + generatedId + " is not undefined for some reason.");
			this._objects[generatedId] = json;
			
			if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
				this._objectIds[json.objectId] = generatedId;
			}
			
			// Detect if this is a blueprint form element and handle it accordingly.
			var clazz = qx.Class.getByName(json.objectClass);
			if (qx.Class.hasMixin(clazz, blueprint.ui.form.MSubmitElement)) {
				var blueprintForm = blueprint.util.Misc.getDeepKey(json, ["qxSettings", "blueprintForm"]);
				
				if (qx.lang.Type.isString(blueprintForm) && blueprintForm != "") {
					if (qx.lang.Type.isArray(this._formObjectIds[blueprintForm])) {
						this._formObjectIds[blueprintForm].push(generatedId);
					} else {
						this._formObjectIds[blueprintForm] = [generatedId];
					}
				} else {
					this._formUnassignedIds.push(generatedId);
				}
			}
		},
		
		/**
		* Protected method for deleting an object and keeping the accounting clean.
		*
		* @param generatedId {String} The string generatedId.
		* @return {void} 
		*/
		deleteObject: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			var json = this._objects[generatedId];
			
			if (this._objectMeta[generatedId].object && this._objects[this._objectMeta[generatedId].parentId]) {
				this._objectMeta[this._objectMeta[generatedId].parentId].object.remove(this._objectMeta[generatedId].object);
			}
			
			// Detect if this is a blueprint form element and handle it accordingly.
			var clazz = qx.Class.getByName(json.objectClass);
			
			// Handle form deletions.
			if (qx.Class.isSubClassOf(clazz, blueprint.data.Form)) {
				this.__deleteForm(generatedId);
			}
			
			// Delete the object from the main indexes.
			if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
				delete(this._objectIds[json.objectId]);
			}
			
			
			
			delete(this._objects[generatedId]);
			delete(this._objectMeta[generatedId]);
		},
		
		/**
		* Private method for deleting a form and the form controller from the json
		* structure.
		*
		* @param formDataObject {blueprint.data.Form} The new form object.
		* @param formControllerObject {blueprint.data.controller.Form} The new form
		* controller object.
		* @return {void}
		*/
		
		__deleteForm: function(generatedId) {
			/*
			TODO: Fix this!
			var formJson = this._objects[generatedId];
			var formObjectId = formJson.objectId;
			qx.core.Assert.assert(qx.lang.Array.contains(this._json.data.complex, formJson), "Form was not found in the complex data structure.");
			
			for (var i in this._formGeneratedIds[generatedId]) {
				var blueprintForm = blueprint.util.Misc.getDeepKey(this._objects[i], ["qxSettings", "blueprintForm"]);
				
				if (blueprintForm == formObjectId) {
					blueprint.util.Misc.setDeepKey(this._objects[i], ["qxSettings", "blueprintForm"], "");
					
					this._formUnassignedIds.push(i);
				}
			}
			
			delete(this._formGeneratedIds[generatedId]);
			
			for (var i=0;i<this._json.controllers.length;i++) {
				var model = blueprint.util.Misc.getDeepKey(this._json.controllers[i], ["constructorSettings", "model"]);
				if (model == formObjectId) {
					var controllerId = blueprint.util.Misc.getDeepKey(this._json.controllers[i], ["__designer", "generatedId"]);
					qx.lang.Array.remove(this._json.controllers, this._json.controllers[i]);
					delete
					i--;
				}
			}
			*/
		},
		
		/**
		* Private method for recursively registering blueprint components.
		*
		* @param json {var} The json components object.
		* @param parentId {string} The generatedId of the parent object.
		* @param container {Array || Object} The object that new json will be added to.
		* @param key {String} If adding to an object, the key used to add to that object.
		* @return {void} 
		*/
		
		_registerDataObject : function(json, parentId, container, key) {
			this.debug("_registerDataObject called with " + parentId + " // " + key );
			qx.core.Assert.assert(qx.lang.Type.isObject(json) || qx.lang.Type.isString(json), "A json object or objectId string must be provided: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided!");
			
			qx.core.Assert.assert(qx.lang.Type.isNumber(key) || qx.lang.Type.isString(key), "A key must be provided and must be a number or a string!");
			qx.core.Assert.assert(qx.lang.Type.isObject(container) || qx.lang.Type.isArray(container), "A container must be provided and must be an Object or an Array!");
			
			
			if (qx.lang.Type.isObject(json)) {
				// If there is a component object that is being registered with an object id, move
				// it to the complex data object and it will be processed with the data objects. 
				if (qx.lang.Type.isString(json.objectId) && json.objectId != "" && this._json.data.complex !== container && this._json.controllers !== container) {
					var tempComponent = json;
					container[key] = json.objectId;
					
					this._json.data.complex.push(tempComponent);
					return null;
				} else {
					var generatedId = "obj" + this.__objectCounter++;
					this._objectMeta[generatedId] = {};
					this._objectMeta[generatedId].parentId = parentId;
					
					container[key] = {
						"args": [generatedId],
						"funct": this._getDataElementJson
					};
					
					this._registerJson(generatedId, json);
					
					if (qx.lang.Type.isObject(json.components)) {
						for (var i in json.components) {
							this._registerDataObject(json.components[i], generatedId, json.components, i);
						}
					}
					
					return generatedId;
				}
			}

			if (qx.lang.Type.isString(json)) {
				// In this case, the json is an objectId string, not a full object.
				// TODO: flatten out any component/data object into the complex data
				// structure and reference it there. If there is no objectId, allow it
				// to be anonymous.
				this._objectIdReferenceSources[json] = parentId;
				this.warn("No return value here. String objectId references are still a work in progress.");
				
				container[key] = {
					"args": [json],
					"funct": this._getDataElementJsonFromObjectId
				};
				
				return null;
			}
		},
		
		/**
		* Private method for checking that all the objectId references in a loaded json
		* file exist. Fires warnings when referenced objectIds are not found.
		*
		* @return {void} 
		*/
		
		__checkObjectIdReferences : function() {
			for (var i in this._objectIdReferenceSources) {
				if (qx.lang.Type.isString(this._objects[i])) {
					this.debug("Verified reference from " + this._objectIdReferenceSources[i] + " to " + i);
				} else {
					this.warn("objectId '" + i + "' referenced by " + this._objectIdReferenceSources[i] + " cannot be found!");
				}
			}
			delete(this._objectIdReferenceSources);
			
			
			// Transform the _formObjectIds object (which references objectIds) into an 
			// object that references generatedIds.
			for (var i in this._formObjectIds) {
				qx.core.Assert.assertString(this._objectIds[i], "Form id " + i + " referenced, but no object has that name!");
				
				this._formGeneratedIds[this._objectIds[i]] = this._formObjectIds[i];
			}
			delete(this._formObjectIds);
			
			
		},
		
		/**
		* Protected method for processing newly loaded json. Provided as a callback
		* to a qx.ui.remote.Request. Calls a _processJson<segment> function for
		* each blueprint json area. 
		*
		* @param e {Event} Response event from a qx.ui.remote.Request.
		* @return {void} 
		*/
		_processJson: function(e) {
			var json = qx.lang.Json.parse(e.getContent());
		
			// Validate here
			
			this._json = json.object;
		
			var generatedId = "obj" + this.__objectCounter++;
			this._objectMeta[generatedId] = {};
			this.__rootGeneratedId = generatedId;
			
			this._registerJson(generatedId, this._json);
		
			this.__carefullyCreateTopKeys(this._json);
			
			this._objectMeta[generatedId] = {};
			this._objectMeta[generatedId].contents = [
				this.__processJsonLayoutWorker(this._json.layout, null, this.__rootGeneratedId)
			];
			this.__processJsonDataWorker(this._json.data);
		
			this.__processJsonControllersWorker(this._json.controllers);
			this.__processJsonBindingsWorker(this._json.bindings);
			this.__processJsonEventsWorker(this._json.events);
		
			this.__processJsonFunctionsWorker(this._json.functions);
			this.__processJsonScriptsWorker(this._json.scripts);
			
			this.__checkObjectIdReferences();
			
			this.fireEvent("jsonLoaded");
		},
		
		/**
		* Private method for recursively indexing the layout section of a blueprint object.
		*
		* @param json {var} The current layout json segment. This function will recurse into
		* all "content" and "component" nodes within the layout json.
		* @return {void} 
		*/
		__processJsonLayoutWorker: function(json, layoutmap, parentId) {
			qx.core.Assert.assertObject(json, "json must be an object: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided: " + parentId);
			qx.core.Assert.assertObject(this._objects[parentId], "parentId must reference an object");
			
			var generatedId = "obj" + this.__objectCounter++;
			
			// Create the designer indexing object. All object specific data will go here.
			this._objectMeta[generatedId] = {};
			this._objectMeta[generatedId].parentId = parentId;
			if (layoutmap) {
				this._objectMeta[generatedId].layoutmap = layoutmap;
			}
			
			this._registerJson(generatedId, json);

		
			this._generateLayoutObject(generatedId, json, parentId);
		
			// recurse through the valid objects for processing
			if (qx.lang.Type.isArray(json.contents)) {
				this._objectMeta[generatedId].contents = [];
				for (var i = 0; i < json.contents.length; i++) {
					this._objectMeta[generatedId].contents.push(this.__processJsonLayoutWorker(json.contents[i].object, json.contents[i].layoutmap, generatedId));
				}
			}


			if (qx.lang.Type.isObject(json.components)) {
				for (var i in json.components) {
					this._registerDataObject(json.components[i], generatedId, json.components, i);
				}
			}
			
			return generatedId;
		},
		
		/**
		* Private method for recursively indexing the data section of a blueprint object.
		*
		* @param json {var} The current data json segment.
		* @return {void} 
		*/
		__processJsonDataWorker: function(json) {
			if (json.simple) {
				for (var i in json.simple) {
					// TODO: Simple data values
					this.warn('Gonna have to do something about simple data values!');
				}
			}
			
			if (json.complex) {
				for (var i=0;i<json.complex.length;i++) {
					this._registerDataObject(json.complex[i], this.__rootGeneratedId, json.complex, i);
				}
			}
		},
		
		/**
		* Private method for indexing the scripts section of a blueprint object.
		*
		* @param json {var} The scripts json segment.
		* @return {void} 
		*/
		__processJsonScriptsWorker: function(json) {},
		
		/**
		* Private method for indexing the functions section of a blueprint object.
		*
		* @param json {var} The function json segment.
		* @return {void} 
		*/
		__processJsonFunctionsWorker: function(json) {},
		
		/**
		* Private method for indexing the controllers section of a blueprint object.
		*
		* @param json {var} The data json segment.
		* @return {void} 
		*/
		__processJsonControllersWorker: function(json) {
			for (var i=0;i<json.length;i++) {
				var clazz = qx.Class.getByName(json[i].objectClass);
				
				if (qx.Class.isSubClassOf(clazz, qx.data.controller.Form)) {
					qx.core.Assert.assertString(this._objectIds[json[i].constructorSettings.model], "Form controllers must refer to an existing object.");
					
					var form = this._objects[this._objectIds[json[i].constructorSettings.model]];
					qx.core.Assert.assertObject(form, "Form controllers must refer to an existing object.");
				}
				
				this._registerDataObject(json[i], this.__rootGeneratedId, json, i);
			}
		},
		
		/**
		* Private method for indexing the bindings section of a blueprint object.
		*
		* @param json {var} The bindings json segment.
		* @return {void} 
		*/
		__processJsonBindingsWorker: function(json) {},
		
		/**
		* Private method for indexing the events section of a blueprint object.
		*
		* @param json {var} The events json segment.
		* @return {void} 
		*/
		__processJsonEventsWorker: function(json) {},
		
		/**
		* Inspects a newly loaded blueprint object and creates the top level keys if they
		* are not present. The top level keys are:
		* <ul>
		* <li>bindings - Array</li>
		* <li>controllers - Array</li>
		* <li>data - Object</li>
		* <li>events - Array</li>
		* <li>functions - Object</li>
		* <li>layout - Object</li>
		* <li>scripts - Object</li>
		* </ul>
		*
		* @param json {var} The top level blueprint object
		* @return {void} 
		*/
		__carefullyCreateTopKeys: function(json) {
			var c = designer.core.manager.Abstract;
		
			for (var key = 0; key < c.__TOP_CONTAINER_OBJECTS.length; key++) {
				if (!qx.lang.Type.isObject(json[c.__TOP_CONTAINER_OBJECTS[key]])) {
					//this.warn("{} ==> creating " + c.__TOP_CONTAINER_OBJECTS[key]);
					json[c.__TOP_CONTAINER_OBJECTS[key]] = {};
				}
			}
		
			for (var key = 0; key < c.__TOP_CONTAINER_ARRAYS.length; key++) {
				if (!qx.lang.Type.isArray(json[c.__TOP_CONTAINER_ARRAYS[key]])) {
					//this.warn("[] ==> creating " + c.__TOP_CONTAINER_ARRAYS[key]);
					json[c.__TOP_CONTAINER_ARRAYS[key]] = [];
				}
			}
		},
		
		/**
		* Replacement algorithm for use with qx.lang.Json.stringify in layout export.
		*
		* @param key {String} The key for the element being inspected.
		* @param value {var} The value for the element being inspected.
		* @return {var} The new value for the inspected key.
		*/
		
		_dereferenceDataObjects : function(key, value) {
			switch(key) {
				case "controllers":
				case "complex":
				qx.core.Assert.assertArray(value, "Controllers and complex data elements expect an array.");
				for (var i=0;i<value.length;i++) {
					if (qx.lang.Type.isObject(value[i]) && qx.lang.Type.isFunction(value[i].funct) && qx.lang.Type.isArray(value[i].args)) {
						qx.core.Init.getApplication().debug('_dereferenceDataObjects match ' + String(key) + " // " + String(value));
						var replacement = value[i].funct.call(qx.core.Init.getApplication().getManager(), value[i].args);
						if (qx.lang.Type.isString(replacement.json.objectId) && replacement.json.objectId != "") {
							return replacement.json;
						} else {
							qx.core.Init.getApplication().debug('0stringified: ' + qx.lang.Json.stringify(value[i]));
							qx.core.Init.getApplication().debug('1stringified: ' + qx.lang.Json.stringify(replacement.json));
							qx.core.Assert.assert(false, "A complex data or controller object was found without an objectId. This should not happen --  will result in an invalid blueprint json object.");
						}
					}
				}
				break;
				
				case "components":
				qx.core.Assert.assertObject(value, "Components within an object should be an object");
				for (var i in value) {
					if (qx.lang.Type.isObject(value[i]) && qx.lang.Type.isFunction(value[i].funct) && qx.lang.Type.isArray(value[i].args)) {
						qx.core.Init.getApplication().debug('_dereferenceDataObjects match ' + String(key) + " // " + String(value));
						var replacement = value[i].funct.call(qx.core.Init.getApplication().getManager(), value[i].args);
						if (qx.lang.Type.isString(replacement.json.objectId) && replacement.json.objectId == "") {
							return replacement.json;
						} else {
							var obj = {}
							obj[i] = replacement.json.objectId;
							return obj;
						}
					}
				}
				break;
			}
			
			return value;
		},
		
		/**
		* Returns the json for a data element given that data element's objectId
		*
		* @param generatedId {String} The generatedId for the requested data element json.
		* @return {Object} The json for the data element.
		*/
		
		_getDataElementJsonFromObjectId : function(objectId) {
			return {
				"generatedId": this._objectIds[objectId],
				"json": this._objects[this._objectIds[objectId]]
			};
		},
		
		/**
		* Returns the json for a data element given that data element's generatedId
		*
		* @param generatedId {String} The generatedId for the requested data element json.
		* @return {Object} The json for the data element.
		*/
		_getDataElementJson: function(generatedId) {
			return {
				"generatedId": generatedId,
				"json": this._objects[generatedId]
			};
		}
	}
});
