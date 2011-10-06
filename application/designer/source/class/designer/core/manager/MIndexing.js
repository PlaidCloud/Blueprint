qx.Mixin.define("designer.core.manager.MIndexing",
{
	construct: function() {
		this.__objectCounter = 0;

		this._objects = {};
		this._objectIds = {};
		this._objectMeta = {};
		this._objectIdReferences = [];
		
		this.__prefixes = {};
		this.__placeHolders = {};

		this._rootGeneratedId = null;
		
		// All blueprint objects are defined with designer.blueprint.*
		this.registerObjectPrefix({
			"blueprint": "designer"
		});
		this.registerObjectPlaceHolder({
			"blueprint.ui.window.Window": "designer.placeholder.Window"
		});
	},
	
	events: {
		/**
		* Fired after json is successfully loaded from a source.
		*/
		jsonLoaded: "qx.event.type.Event"
	},
	
  	members : {
	  	__objectCounter: null,
	  	__placeHolders: null,
		__prefixes: null,
	  	_objectIds: null,
		_objectMeta: null,
		_objects: null,
		_rootGeneratedId: null,
		
		__importData : function(json, parentId) {
			this.debug("__importData called with " + parentId + " // " + json.objectClass);
			qx.core.Assert.assert(qx.lang.Type.isObject(json), "A json object must be provided to __importData: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided!");
			
			var generatedId = this._registerJson(json);
			this._objectMeta[generatedId] = {};
			this._objectMeta[generatedId].parentId = parentId;
			
			this.__iterateComponents(json, generatedId);
			
			return generatedId;			
		},
		
		__importLayout : function(json, layoutmap, parentId) {
			qx.core.Assert.assertObject(json, "json must be an object: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided: " + parentId);
			qx.core.Assert.assertObject(this._objects[parentId], "parentId must reference an object");
			
			var generatedId = this._registerJson(json);
			this._objectMeta[generatedId].parent = parentId;
			
			if (layoutmap) {
				this._objectMeta[generatedId].layoutmap = layoutmap;
			}
			
			this.__iterateContents(json, generatedId);
			this.__iterateComponents(json, generatedId);
			
			return generatedId;
		},
		
		__iterateComponents : function(json, generatedId) {
			this._objectMeta[generatedId].components = [];
			if (qx.lang.Type.isObject(json.components)) {
				for (var i in json.components) {
					if (qx.lang.Type.isObject(json.components[i])) {
						this._objectMeta[generatedId].components.push(this.__importData(json.components[i], generatedId));
					} else if (qx.lang.Type.isString(json.components[i])) {
						this._objectIdReferences.push({json: json, generatedId: generatedId, i: i});
						this.warn('ObjectId reference found.');
					} else {
						throw new Error("Component of unknown type encountered.");
					}
				}
			}
			delete(json.components);
		},
		
		__iterateContents : function(json, generatedId) {
			this._objectMeta[generatedId].contents = [];
			// recurse through the valid contents objects for processing
			if (qx.lang.Type.isArray(json.contents)) {
				for (var i = 0; i < json.contents.length; i++) {
					this._objectMeta[generatedId].contents.push(this.__importLayout(json.contents[i].object, json.contents[i].layoutmap, generatedId));
				}
			}
			delete(json.contents);
		},
		
		__renderLayout : function(generatedId) {
			var parentId = this._objectMeta[generatedId].parent;
			var json = this._objects[generatedId];
			
			var parent, layoutmap;
			
			if (parentId == this._rootGeneratedId) {
				parent = this.getLayoutPage();
				layoutmap = { top: 1, left: 1 };
			} else {
				parent = this._objectMeta[parentId].qxTarget
				layoutmap = this._objectMeta[generatedId].layoutmap;
			}
			
			var clazz = this.getClass(json.objectClass);
			this.debug("about to build: " + json.objectClass + " // " + clazz);
			
			if (!json.constructorSettings) { json.constructorSettings = {}; }
			if (!json.qxSettings) { json.qxSettings = {}; }
			
			var newObject = new clazz(json, "designer", true);
			
			this._objectMeta[generatedId].qxTarget = newObject;
		
			newObject.setGeneratedId(generatedId);
			
			this.debug("Adding " + newObject + " to " + parent + " with " + qx.lang.Json.stringify(layoutmap));
			parent.layoutAdd(newObject, layoutmap);
			
			for (var i=0;i<this._objectMeta[generatedId].contents.length;i++) {
				this.__renderLayout(this._objectMeta[generatedId].contents[i]);
			}
		},
		
		/**
		* Protected method for processing newly loaded json.
		* Validation of the json should happen before this method is called.
		*
		* @param json {Object} New json object to be parsed.
		* @return {void} 
		*/
		_importTopContainer : function(json) {
			qx.core.Assert.assert(json.objectClass == "blueprint.TopContainer", "Imported Object is not a top container.");
			
			var generatedId = this._registerJson(json);
			this._rootGeneratedId = generatedId;
			
			this._objectMeta[generatedId].layout = this.__importLayout(json.layout, null, generatedId);
			this._objectMeta[generatedId].parent = null;
			delete(json.layout);
			
			this._objectMeta[generatedId].data;
			delete(json.data);
			
			this._objectMeta[generatedId].controllers;
			delete(json.controllers);
			
			this._objectMeta[generatedId].bindings;
			delete(json.bindings);
			
			this._objectMeta[generatedId].events;
			delete(json.events);
			
			this._objectMeta[generatedId].functions;
			delete(json.functions);
			
			this._objectMeta[generatedId].scripts;
			delete(json.scripts);
			
			//this.__checkObjectIdReferences();
			
			this.getLayoutPage().clearPage();
			this.__renderLayout(this._objectMeta[generatedId].layout);
			
			this.fireEvent("jsonLoaded");
		},
		
		/**
		* Protected method for registering a new json object.
		* This assigns a generatedId to the object and initializes the meta information
		* store for it. It also registers objectIds and blueprintForm references.
		*
		* @param json {Object} The object to be registered.
		* @return {String} The generatedId for the registered object.
		*/
		
		_registerJson: function(json) {
			var generatedId = "obj" + this.__objectCounter++;
			
			this._objects[generatedId] = json;
			this._objectMeta[generatedId] = {};
			
			if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
				this._objectIds[json.objectId] = generatedId;
			}
			
			// Detect if this is a blueprint form element and handle it accordingly.
			/*
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
			*/
			return generatedId;
		},
		
		/**
		* Method for getting the root layout object.
		* @return {String} The generated id of the root layout object
		*/
		getRootLayoutObject: function() {
			qx.core.Assert.assertString(this._rootGeneratedId, "No json is loaded!");
			return this._rootGeneratedId;
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
		}
	}
});