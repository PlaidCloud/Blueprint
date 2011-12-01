qx.Mixin.define("designer.core.manager.MIndexing",
{
	construct: function() {
		this._prefixes = {};
		this._placeHolders = {};
		
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
	  	_placeHolders: null,
		_prefixes: null,
	  	_objectIds: null,
		_objectMeta: null,
		_objects: null,
		_rootGeneratedId: null,
		
		__iterateComponents : function(json, generatedId) {
			this._objectMeta[generatedId].components = {};
			if (qx.lang.Type.isObject(json.components)) {
				for (var i in json.components) {
					if (qx.lang.Type.isObject(json.components[i])) {
						var componentId = this._importData(json.components[i], generatedId);
						this._objectMeta[generatedId].components[i] = componentId;
						this._objectMeta[componentId].metaKey = "components." + i;
					} else if (qx.lang.Type.isString(json.components[i])) {
						this._objectIdReferences.push({json: json, generatedId: generatedId, i: i, referencedId: json.components[i]});
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
					var layoutId = this._importLayout(json.contents[i].object, json.contents[i].layoutmap, generatedId);
					this._objectMeta[generatedId].contents.push(layoutId);
					this._objectMeta[layoutId].metaKey = "contents." + i;
				}
			}
			delete(json.contents);
		},
		
		/**
		* Private method for checking that all the objectId references in a loaded json
		* file exist. Fires warnings when referenced objectIds are not found.
		*
		* @return {void} 
		*/
		
		_checkObjectIdReferences : function() {
			for (var i=0;i<this._objectIdReferences.length;i++) {
				// } else if (qx.lang.Type.isString(json.components[i])) {
				// this._objectIdReferences.push({json: json, generatedId: generatedId, i: i, referencedId: json.components[i]});
				var r = this._objectIdReferences[i];
			
				qx.core.Assert.assertString(this._objectIds[r.referencedId], "Error: " + r.referencedId + " not found; Referenced from " + r.generatedId);
				
				this._objectMeta["obj2"].components[r.i] = this._objectIds[r.referencedId];
			}
		},
		
		_importData : function(json, parentId) {
			this.debug("_importData called with " + parentId + " // " + json.objectClass);
			qx.core.Assert.assert(qx.lang.Type.isObject(json), "A json object must be provided to _importData: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided!");
			
			var generatedId = this._registerJson(json);
			
			this._objectMeta[generatedId].parentId = parentId;
			
			this.__iterateComponents(json, generatedId);
			
			return generatedId;			
		},
		
		_importLayout : function(json, layoutmap, parentId) {
			qx.core.Assert.assertObject(json, "json must be an object: " + json);
			qx.core.Assert.assertString(parentId, "A parentId must be provided: " + parentId);
			qx.core.Assert.assertObject(this._objects[parentId], "parentId must reference an object");
			
			var generatedId = this._registerJson(json);
			this._objectMeta[generatedId].parentId = parentId;
			
			if (layoutmap) {
				this._objectMeta[generatedId].layoutmap = layoutmap;
			}
			
			this.__iterateContents(json, generatedId);
			this.__iterateComponents(json, generatedId);
			
			return generatedId;
		},
		
		_renderLayout : function(generatedId) {
			if (!generatedId) { generatedId = this._objectMeta[this._rootGeneratedId].layout; }
			var parentId = this._objectMeta[generatedId].parentId;
			var json = this._objects[generatedId];
			
			var parent, layoutmap;
			
			if (parentId == this._rootGeneratedId) {
				parent = this.getLayoutPage();
				layoutmap = { top: 1, left: 1 };
				parent.clearPage();
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
				this._renderLayout(this._objectMeta[generatedId].contents[i]);
			}
		},
		
		_exportJson : function(generatedId) {
			generatedId = generatedId || this._rootGeneratedId;
			
			var json = blueprint.util.Misc.copyJson(this._objects[generatedId]);
			
			if (this._objectMeta[generatedId].layout) {
				json.layout = this._exportJson(this._objectMeta[generatedId].layout);
			}
			
			if (this._objectMeta[generatedId].contents && this._objectMeta[generatedId].contents.length > 0) {
				json.contents = [];
				for (var i=0;i<this._objectMeta[generatedId].contents.length;i++) {
					var childId = this._objectMeta[generatedId].contents[i];
					var obj = {};
					if (this._objectMeta[childId].layoutmap) {
						obj.layoutmap = this._objectMeta[childId].layoutmap;
					}
					obj.object = this._exportJson(childId);
					json.contents.push(obj);
				}
			}
			
			if (this._objectMeta[generatedId].components && !qx.lang.Object.isEmpty(this._objectMeta[generatedId].components)) {
				json.components = {};
				for (var i in this._objectMeta[generatedId].components) {
					if (this._objects[this._objectMeta[generatedId].components[i]].objectId == "") {
						json.components[i] = this._exportJson(this._objectMeta[generatedId].components[i]);
					} else {
						json.components[i] = this._objects[this._objectMeta[generatedId].components[i]].objectId;
					}
				}
			}
			
			if (this._objectMeta[generatedId].data) {
				json.data = {};
				json.data.simple = {};
				json.data.complex = [];
				if (this._objectMeta[generatedId].data.simple && !qx.lang.Object.isEmpty(this._objectMeta[generatedId].data.simple)) {
					for (var i in this._objectMeta[generatedId].data.simple) {
						json.data.simple[i] = this._objectMeta[generatedId].data.simple[i];
					}
				}
				
				if (this._objectMeta[generatedId].data.complex && this._objectMeta[generatedId].data.complex.length > 0) {
					for (var i=0;i<this._objectMeta[generatedId].data.complex.length;i++) {
						json.data.complex.push(this._exportJson(this._objectMeta[generatedId].data.complex[i]));
					}
				}
			}
			
			
			this._objectMeta[generatedId].controllers
			this._objectMeta[generatedId].bindings
			this._objectMeta[generatedId].functions
			this._objectMeta[generatedId].events
			
			if (generatedId == this._rootGeneratedId) {
				// data export
				json.data = {};
				if (this._objectMeta[generatedId].data.simple && !qx.lang.Object.isEmpty(this._objectMeta[generatedId].data.simple)) {
					json.data.simple = {};
					for (var i in this._objectMeta[generatedId].data.simple) {
						json.data.simple[i] = this._objectMeta[generatedId].data.simple[i];
					}
				}
				
				if (this._objectMeta[generatedId].data.complex && this._objectMeta[generatedId].data.complex.length > 0) {
					json.data.complex = [];
					for (var i=0;i<this._objectMeta[generatedId].data.complex.length;i++) {
						json.data.complex.push(this._exportJson(this._objectMeta[generatedId].data.complex[i]));
					}
				}
				
				// controller export
				json.controllers = [];
				if (this._objectMeta[generatedId].controllers && this._objectMeta[generatedId].controllers.length > 0) {
					for (var i=0;i<this._objectMeta[generatedId].controllers.length;i++) {
						json.controllers.push(this._exportJson(this._objectMeta[generatedId].controllers[i]));
					}
				}
				
				// binding export
				json.bindings = [];
				if (this._objectMeta[generatedId].bindings && this._objectMeta[generatedId].bindings.length > 0) {
					for (var i=0;i<this._objectMeta[generatedId].bindings.length;i++) {
						json.bindings.push(this._exportJson(this._objectMeta[generatedId].bindings[i]));
					}
				}
				
				// events export
				json.events = [];
				if (this._objectMeta[generatedId].events && this._objectMeta[generatedId].events.length > 0) {
					for (var i=0;i<this._objectMeta[generatedId].events.length;i++) {
						json.events.push(this._exportJson(this._objectMeta[generatedId].events[i]));
					}
				}
				
				// functions export
				json.functions = {};
				if (this._objectMeta[generatedId].functions && !qx.lang.Object.isEmpty(this._objectMeta[generatedId].functions)) {
					for (var i in this._objectMeta[generatedId].functions) {
						json.functions[i] = this._exportJson(this._objectMeta[generatedId].functions[i]);
					}
				}
			}
			
			return json;
		},
		
		/**
		* Protected method for processing newly loaded json.
		* Validation of the json should happen before this method is called.
		*
		* @param json {Object} New json object to be parsed.
		* @return {void} 
		*/
		importTopContainer : function(json) {
			this.__objectCounter = 0;
	
			this._objects = {};
			this._objectIds = {};
			this._objectMeta = {};
			this._objectIdReferences = [];
		
			qx.core.Assert.assert(json.objectClass == "blueprint.TopContainer", "Imported Object is not a top container.");
			
			var generatedId = this._registerJson(json);
			this._rootGeneratedId = generatedId;
			this._objectMeta[generatedId].parentId = null;
			this._objectMeta[generatedId].metaKey = null;
			
			var layoutId = this._importLayout(json.layout, null, generatedId);
			this._objectMeta[generatedId].layout = layoutId;
			this._objectMeta[layoutId].metaKey = "layout";
			delete(json.layout);
			
			
			this._objectMeta[generatedId].data = {};
			this._objectMeta[generatedId].data.simple = {};
			this._objectMeta[generatedId].data.complex = [];
			
			if (json.data.simple) {
				for (var i in json.data.simple) {
					this._objectMeta[generatedId].data.simple[i] = blueprint.util.Misc.copyJson(json.data.simple[i]);
				}
			}
			if (json.data.complex) {
				for (var i=0;i<json.data.complex.length;i++) {
					var dataId = this._importData(json.data.complex[i], generatedId);
					this._objectMeta[generatedId].data.complex.push(dataId);
					this._objectMeta[dataId].metaKey = "data.complex." + i;
				}
			}
			delete(json.data);
			
			this._objectMeta[generatedId].controllers = [];
			for (var i=0;i<json.controllers.length;i++) {
				var controllerId = this._importData(json.controllers[i], generatedId);
				this._objectMeta[generatedId].controllers.push(controllerId);
				this._objectMeta[controllerId].metaKey = "controllers." + i;
			}
			delete(json.controllers);
			
			this._objectMeta[generatedId].bindings = [];
			for (var i=0;i<json.bindings.length;i++) {
				var bindingId = this._registerBindings(json.bindings[i]);
				this._objectMeta[generatedId].bindings.push(bindingId);
				this._objectMeta[bindingId].metaKey = "bindings." + i;
			}
			delete(json.bindings);
			
			this._objectMeta[generatedId].events = [];
			for (var i=0;i<json.events.length;i++) {
				var eventId = this._registerEvents(json.events[i]);
				this._objectMeta[generatedId].events.push(eventId);
				this._objectMeta[eventId].metaKey = "events." + i;
			}
			delete(json.events);
			
			this._objectMeta[generatedId].functions = {};
			for (var i in json.functions) {
				var functionId = this._registerFunctions(json.functions[i]);
				this._objectMeta[generatedId].functions[i] = functionId;
				this._objectMeta[functionId].metaKey = "functions." + i;
			}
			delete(json.functions);
			
			this._checkObjectIdReferences();
			
			this.getLayoutPage().clearPage();
			this._renderLayout();
			
			this.indexForms();
			
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
				qx.core.Assert.assertUndefined(this._objectIds[json.objectId], "objectId: " + json.objectId + " was already declared.");
				this._objectIds[json.objectId] = generatedId;
			}
			
			return generatedId;
		},
		
		_registerBindings : function(json) {
			qx.core.Assert.assert(qx.lang.Type.isObject(json), "A json object must be provided to _registerBindings: " + json);
			
			var generatedId = "obj" + this.__objectCounter++;
			
			this._objects[generatedId] = json;
			this._objectMeta[generatedId] = {};
			
			this._objectMeta[generatedId].parentId = this._rootGeneratedId;
			
			return generatedId;			
		},
		
		_registerEvents : function(json) {
			qx.core.Assert.assert(qx.lang.Type.isObject(json), "A json object must be provided to _registerEvents: " + json);
			
			var generatedId = "obj" + this.__objectCounter++;
			
			this._objects[generatedId] = json;
			this._objectMeta[generatedId] = {};
			
			this._objectMeta[generatedId].parentId = this._rootGeneratedId;
			
			return generatedId;			
		},
		
		_registerFunctions : function(json) {
			qx.core.Assert.assert(qx.lang.Type.isObject(json), "A json object must be provided to _registerFunctions: " + json);
			
			var generatedId = "obj" + this.__objectCounter++;
			
			this._objects[generatedId] = json;
			this._objectMeta[generatedId] = {};
			
			this._objectMeta[generatedId].parentId = this._rootGeneratedId;
			
			return generatedId;			
		},
		
		/**
		* Method for getting the root object.
		* @return {String} The generated id of the root layout object
		*/
		getRootObject: function() {
			qx.core.Assert.assertString(this._rootGeneratedId, "No json is loaded!");
			return this._rootGeneratedId;
		},
		
		/**
		* Method for getting the root layout object.
		* @return {String} The generated id of the root layout object
		*/
		getRootLayoutObject: function() {
			qx.core.Assert.assertString(this._rootGeneratedId, "No json is loaded!");
			return this._objectMeta[this._rootGeneratedId].layout;
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
				this._placeHolders[clazz] = placeholder;
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
				this._prefixes[namespace] = prefix;
			}
		}
	}
});