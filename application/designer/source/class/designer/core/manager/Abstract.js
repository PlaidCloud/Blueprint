qx.Class.define("designer.core.manager.Abstract", {
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

		this._json = null;
		this._objects = {};
		this._objectIds = {};
		this._formGeneratedIds = {};
		this._formObjectIds = {};
		this._formUnassignedIds = [];
		this._objectIdReferenceSources = {};
		this._propertyBlackList = [];
		this.__objectCounter = 0;
		this.__prefixes = {};
		this.__placeHolders = {};

		// All blueprint objects are defined with designer.blueprint.*
		this.registerObjectPrefix("blueprint", "designer");
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
		__prefixes: null,
		__placeHolders: null,
		_propertyBlackList: null,
		_json: null,
		_objects: null,
		_objectIds: null,
		_objectIdReferenceSources: null,
		_formObjectIds: null,
		_formGeneratedIds: null,
		_formUnassignedIds : null,

		/**
		* Worker function to create a new layout object.
		*
		* @param layoutObject {blueprint.data.Form} The new object.
		* @param layoutmap {Object} The layout map for the new object (if necessary.)
		* @param parentId {String}
		* @return {void}
		*/
		
		_createLayoutObjectWorker: function(layoutObject, layoutmap, parentId) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			
			var parent = blueprint.util.Misc.getDeepKey(this._objects[parentId], ["__designer", "object"]);
			qx.core.Assert.assertFunction(parent.add, "Specified parent does not support an add method.");
			qx.core.Assert.assertFunction(parent.getLayout, "Specified parent does not support the getLayout method.");
			
			var parentJson = this._objects[parentId];
			
			if (!qx.lang.Type.isArray(parentJson.contents)) {
				parent.contents = [];
			}
			
			this.__processJsonLayoutWorker(blueprint.util.Misc.copyJson(layoutObject), layoutmap, parentId);
			
			this.fireEvent("layoutUpdate");
		},

		/**
		* Worker function to create a new form from json objects.
		*
		* @param formDataObject {blueprint.data.Form} The new form object.
		* @param formControllerObject {blueprint.data.controller.Form} The new form
		* controller object.
		* @return {void}
		*/
		
		_createFormWorker: function(formDataObject, formControllerObject) {
			var newData = blueprint.util.Misc.copyJson(formDataObject);
			var newController = blueprint.util.Misc.copyJson(formControllerObject);
			
			qx.core.Assert.assertArray(this._json.data.complex, "this._json has no complex data object array!");
			qx.core.Assert.assertArray(this._json.controllers, "this._json has no controllers object array!");
			
			this._json.data.complex.push(newData);
			this._json.controllers.push(newController);
			
			this._registerDataObject(newData);
			this._registerDataObject(newController);
			
			var formGeneratedId = blueprint.util.Misc.getDeepKey(newData, ["__designer", "generatedId"]);
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
					this.registerObjectPlaceHolder(n, namespace[n]);
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
		
			qx.core.Assert.assertString(this.__prefixes[namespace], "Namespace for requested object was not registered.");
		
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
				oldFormGeneratedId = blueprint.util.Misc.getDeepKey(this._objects[this._objectIds[oldFormObjectId]], ["__designer", "generatedId"]);
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
			var parent, layoutmap, target, addFunction;
			if (parentId === null) {
				// This is a top level object; add it directly to the layout page.
				parent = this.getLayoutPage();
				layoutmap = {
					top: 1,
					left: 1
				};
				target = "paneRight";
			} else {
				qx.core.Assert.assertObject(this._objects[parentId], "Parent object must exist in the object registry.");
				parent = this._objects[parentId].__designer.object
				layoutmap = this._objects[generatedId].__designer.layoutmap
				target = undefined;
			}
		
			var clazz = this.getClass(objectClass);
			this.debug("about to build: " + objectClass + " // " + clazz);
		
			//TODO - only pass in a copy of the relevant json
			var newObject = new clazz(vData, "designer", true);
		
			blueprint.util.Misc.setDeepKey(this._objects[generatedId], ["__designer", "object"], newObject);
		
			newObject.setGeneratedId(generatedId);
			
			parent.add(newObject, layoutmap, target);
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
		getObjectChildren: function(generatedId) {
		    qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " does not exist in the manager!");
		    var parent = this._objects[generatedId];
		    
		    if (parent === this._json) {
		    	// This is the top container; handled as a special case.
		    	qx.core.Assert.assertString(parent.layout.__designer.generatedId, "Top container has no layout children!");
		    	return [parent.layout.__designer.generatedId];
		    } else {
		    	var children = [];
		    	if (qx.lang.Type.isArray(parent.contents)) {
		    		for (var i=0;i<parent.contents.length;i++) {
		    			qx.core.Assert.assertString(parent.contents[i].object.__designer.generatedId, "For some reason, a child of " + generatedId + " does not have a generatedId. This probably shouldn't happen.");
		    			children.push(parent.contents[i].object.__designer.generatedId);
		    		}
		    	}
		    	return children;
		    }
		},
		
		/**
		* Method for setting the selection in the layout pane
		* @param generatedId {String} The id of the target object.
		* @return {void}
		*/
		setSelection : function(generatedId) {
		    qx.core.Assert.assertObject(this._objects[generatedId].__designer.object, "generatedId: " + generatedId + " does not have an object associated with it in the design json!");
			designer.core.manager.Selection.getInstance().setSelection(this._objects[generatedId].__designer.object);
		},
		
		/**
		* Method for getting the root layout object.
		* @return {String} The generated id of the root layout object
		*/
		getRootLayoutObject: function() {
			qx.core.Assert.assertObject(this._json, "No json is loaded!");
		    return blueprint.util.Misc.getDeepKey(this._json, ["__designer", "generatedId"]);
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
		
			if (qx.lang.Type.isFunction(this._objects[generatedId].__designer.object.jsonChanged)) {
				this._objects[generatedId].__designer.object.jsonChanged(propertyName, value);
			} else {
				this.warn("jsonChanged function not found on: " + this._objects[generatedId].__designer.object);
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
		* Protected method for processing newly loaded json. Provided as a callback
		* to a qx.ui.remote.Request. Calls a _processJson<segment> function for
		* each blueprint json area. 
		*
		* @param e {Event} Response event from a qx.ui.remote.Request.
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
		* Private method for recursively registering blueprint components.
		*
		* @param json {var} The json components object.
		* @param parentId {string} The generatedId of the parent object.
		* @return {void} 
		*/
		
		_registerDataObject : function(json, parentId) {
			if (qx.lang.Type.isObject(json)) {
				var generatedId = "obj" + this.__objectCounter++;
				blueprint.util.Misc.setDeepKey(json, ["__designer", "generatedId"], generatedId);
				
				this._registerJson(generatedId, json);
				
				if (qx.lang.Type.isObject(json.components)) {
					for (var i in json.components) {
						this._registerDataObject(json.components[i], generatedId);
					}
				}
			}

			if (qx.lang.Type.isString(json)) {
				// In this case, the json is an objectId string, not a full object.
				this._objectIdReferenceSources[json] = parentId;
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
			blueprint.util.Misc.setDeepKey(this._json, ["__designer", "generatedId"], generatedId);
			
			this._registerJson(generatedId, this._json);
		
			this.__carefullyCreateTopKeys(this._json);
		
			this.__processJsonLayoutWorker(this._json.layout, null, null);
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
			var generatedId = "obj" + this.__objectCounter++;
			blueprint.util.Misc.setDeepKey(json, ["__designer", "generatedId"], generatedId);
			
			this._registerJson(generatedId, json);
			
			// Create the designer indexing object. All object specific data will go here.
			if (parentId) {
				blueprint.util.Misc.setDeepKey(json, ["__designer", "parentId"], parentId);
			}
			if (layoutmap) {
				blueprint.util.Misc.setDeepKey(json, ["__designer", "layoutmap"], layoutmap);
			}
		
			this._generateLayoutObject(generatedId, json, parentId);
		
			// recurse through the valid objects for processing
			if (qx.lang.Type.isArray(json.contents)) {
				for (var i = 0; i < json.contents.length; i++) {
					this.__processJsonLayoutWorker(json.contents[i].object, json.contents[i].layoutmap, generatedId);
				}
			}
		
			if (qx.lang.Type.isObject(json.components)) {
				for (var i in json.components) {
					this._registerDataObject(json.components[i], generatedId);
				}
			}
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
					this._registerDataObject(json.complex[i]);
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
				this._registerDataObject(json);
				
				var clazz = qx.Class.getByName(json.objectClass);
				
				if (qx.Class.isSubClassOf(clazz, qx.data.controller.Form)) {
					this.warn('Found us a form controller, Billy.');
				}
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
		}
	}
});
