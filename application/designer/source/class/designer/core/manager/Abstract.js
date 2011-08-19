qx.Class.define("designer.core.manager.Abstract",
{
  extend : qx.core.Object,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * The abstract manager constructor.
   */

  construct : function()
  {
    this.base(arguments);

    this._json = null;
    this._objects = {};
    this._objectIds = {};
    this.__objectCounter = 0;
    this.__prefixes = {};
    this.__placeHolders = {};
    
    // All blueprint objects are defined with designer.blueprint.*
    this.registerObjectPrefix("blueprint", "designer");
    this.registerObjectPlaceHolder({"blueprint.ui.window.Window": "designer.placeholder.Window"});
  },

  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired after json is successfully loaded from a source.
     */
    jsonLoaded : "qx.event.type.Event",

    /**
     * Fired when the json is successfully exported and saved to a source.
     */
    jsonSaved : "qx.event.type.Event",

    /**
     * Fired when some element in the bindings json has changed. The passed data is
     * the generatedId of the changed object.
     */
    bindingsUpdate : "qx.event.type.Data",

    /**
     * Fired when some element in the controllers json has changed. The passed data is
     * the generatedId of the changed object.
     */
    controllersUpdate : "qx.event.type.Data",

    /**
     * Fired when some element in the data json has changed. The passed data is
     * the generatedId of the changed object.
     */
    dataUpdate : "qx.event.type.Data",

    /**
     * Fired when some element in the events json has changed. The passed data is
     * the generatedId of the changed object.
     */
    eventsUpdate : "qx.event.type.Data",

    /**
     * Fired when some element in the functions json has changed.
     */
    functionsUpdate : "qx.event.type.Event",

    /**
     * Fired when some element in the layout json has changed. The passed data is
     * the generatedId of the changed object.
     */
    layoutUpdate : "qx.event.type.Data",

    /**
     * Fired when some element in the scripts json has changed.
     */
    scriptsUpdate : "qx.event.type.Event"
  },
  
  properties : {
	layoutPage : {
		check : "designer.ui.LayoutPage"
	}
  },

  statics :
  {
    __TOP_CONTAINER_OBJECTS : [ "layout", "data", "scripts", "functions" ],
    __TOP_CONTAINER_ARRAYS  : [ "controllers", "bindings", "events" ],
    
    __checks :
    {
      "Boolean"   : qx.core.Assert.assertBoolean,
      "String"    : qx.core.Assert.assertString,

      "Number"    : qx.core.Assert.assertNumber,
      "Integer"   : qx.core.Assert.assertInteger,
      "PositiveNumber" : qx.core.Assert.assertPositiveNumber,
      "PositiveInteger" : qx.core.Assert.assertPositiveInteger,

      "Object"    : qx.core.Assert.assertObject,
      "Array"     : qx.core.Assert.assertArray
    }
  },

  members :
  {
    __objectCounter : null,
    __prefixes : null,
    __placeHolders : null,
    _json : null,
    _objects : null,
    _objectIds : null,

    /**
     * Register a new prefix for a namespace. For example, registering 'designer.' as
     * as prefix for all objects in the 'blueprint.*' namespace.
     *
     * @param obj {String || Object} The string objectClass or an Object containing
     * a map of key value pairs.
     * @param placeholder {String} The string class name for the placeholder.
     * @return {void}
     */
    
    registerObjectPlaceHolder : function(clazz, placeholder) {
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
    
    registerObjectPrefix : function(namespace, prefix) {
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
    
    getClass : function(objectClass) {
    	if (this.__placeHolders[objectClass]) {
    		return qx.Class.getByName(this.__placeHolders[objectClass]);
    	}
    	
    	var namespace = objectClass.slice(0,objectClass.indexOf('.'));
    	
    	qx.core.Assert.assertString(this.__prefixes[namespace], "Namespace for requested object was not registered.");
    	
    	return qx.Class.getByName(this.__prefixes[namespace] + "." + objectClass);
    },
    
    /**
     * Generate a new object and place it into a parent
     *
     * @param generatedId {String} The id of the target class.
     * @param options {Object} The vData constructor object to be passed into the new object.
     * @param parentId {String} The id of the parent object.
     * @return {void}
     */
    generateLayoutObject : function(generatedId, vData, parentId) {
    	this.debug("Calling generateLayoutObject with " + generatedId + ", " + parentId);
    	var objectClass = this._objects[generatedId].objectClass;
    	var parent, layoutmap, target, addFunction;
    	if (parentId === null) {
    		// This is a top level object; add it directly to the layout page.
    		parent = this.getLayoutPage();
    		layoutmap = {top: 1, left: 1};
    		target = "paneRight";
    	} else {
    		qx.core.Assert.assertObject(this._objects[parentId], "Parent object must exist in the object registry.");
    		parent = this._objects[parentId].__designer.object
    		layoutmap = this._objects[generatedId].__designer.layoutmap
    		target = undefined;
    	}
    	
    	var clazz = this.getClass(objectClass);
    	this.debug("about to build: " + objectClass + " // "  + clazz);
    	
    	//TODO - only pass in a copy of the relevant json
    	
    	var newObject = new clazz(vData, "designer", true);
    	
    	blueprint.util.Misc.setDeepKey(this._objects[generatedId], [ "__designer", "object" ], newObject);
    	
    	newObject.setGeneratedId(generatedId);
    	
    	if (qx.lang.Type.isFunction(parent.getLayout)) {
    		var layoutName = parent.getLayout().classname
    		switch (layoutName) {
    			case "qx.ui.layout.Canvas":
    			newObject.makeResizable();
    			newObject.makeMovable();
    			break;
    			
    			default:
    			newObject.makeResizable();
    			break;
    		}
    	}
    	
    	parent.add(newObject, layoutmap, target);
    },

    /**
     * Method for getting the objectClass from a generatedId.
     *
     * @param generatedId {String} The id of the target object.
     * @return {String} The objectClass string.
     */
    getObjectClass : function(generatedId) {
    	return this._objects[generatedId].objectClass;
    },
    
    /**
     * Method for setting a property on a generated blueprint object.
     *
     * @param generatedId {String} The id of the target object.
     * @param propertyName {String} The name of the property to set.
     * @param value {String} The new value to be set.
     * @return {Number} Returns 0 if successful.
     */

	setProperty : function(generatedId, propertyName, value) {
		var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
		
		var propDef = qx.Class.getPropertyDefinition(clazz, propertyName);
		qx.core.Assert.assert(propDef !== null, "Property not found.");
		
		designer.core.manager.Abstract.__checks[propDef.check](value, "Value: " + value + " does not match type: " + propDef.check);
		
		if (value != propDef.init) {
			this._objects[generatedId].qxSettings[propertyName] = blueprint.util.Misc.copyJson(value);
		} else {
			delete(this._objects[generatedId].qxSettings[propertyName]);
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
	
	getProperty : function(generatedId, propertyName) {
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

	setConstructorSetting : function(generatedId, constructorSetting, value) {
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
     * Returns the property definition init value if no value is set.
     */
	
	getConstructorSetting : function(generatedId, constructorSetting) {
		var cSetting = blueprint.util.Misc.getDeepKey(this._objects[generatedId], [ "constructorSettings", constructorSetting ]);

		return blueprint.util.Misc.copyJson(cSetting);
	},

    /**
     * Protected method for processing newly loaded json. Provided as a callback
     * to a qx.ui.remote.Request. Calls a _processJson<segment> function for
     * each blueprint json area. 
     *
     * @param e {Event} Response event from a qx.ui.remote.Request.
     * @return {void} 
     */
    _processJson : function(e)
    {
      var json = qx.lang.Json.parse(e.getContent());

      // Validate here
      this._json = json.object;

      var generatedId = this.__objectCounter++;
      this._objects[generatedId] = json;
      blueprint.util.Misc.setDeepKey(this._json, [ "__designer", "generatedId" ], generatedId);

      this.__carefullyCreateTopKeys(this._json);
      
      this.__processJsonLayoutWorker(this._json.layout, null, null);
      this.__processJsonDataWorker(this._json.data);
      
      this.__processJsonControllersWorker(this._json.controllers);
      this.__processJsonBindingsWorker(this._json.bindings);
      this.__processJsonEventsWorker(this._json.events);
      
      this.__processJsonFunctionsWorker(this._json.functions);
      this.__processJsonScriptsWorker(this._json.scripts);
      
      this.fireEvent("jsonLoaded");
    },


    /**
     * Private method for recursively indexing the layout section of a blueprint object.
     *
     * @param json {var} The current layout json segment. This function will recurse into
     * all "content" and "component" nodes within the layout json.
     * @return {void} 
     */
    __processJsonLayoutWorker : function(json, layoutmap, parentId)
    {
      var generatedId = "obj" + this.__objectCounter++;
      this._objects[generatedId] = json;
      
      if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
        this._objectIds[json.objectId] = json;
      }

      // Create the designer indexing object. All object specific data will go here.
      blueprint.util.Misc.setDeepKey(json, [ "__designer", "generatedId" ], generatedId);
      if (parentId) {
		blueprint.util.Misc.setDeepKey(json, [ "__designer", "parentId" ], parentId);
      }
      if (layoutmap) {
		blueprint.util.Misc.setDeepKey(json, [ "__designer", "layoutmap" ], layoutmap);
      }
      
      this.generateLayoutObject(generatedId, json, parentId);

      // recurse through the valid objects for processing
      if (qx.lang.Type.isArray(json.contents))
      {
        for (var i=0; i<json.contents.length; i++) {
          this.__processJsonLayoutWorker(json.contents[i].object, json.contents[i].layoutmap, generatedId);
        }
      }

      if (qx.lang.Type.isObject(json.components))
      {
        for (var i in json.components)
        {
          if (qx.lang.Type.isObject(json.components[i])) {
            this.__processJsonLayoutWorker(json.components[i]);
          }

          if (qx.lang.Type.isString(json.components[i])) {
            this.debug('Found string reference to a data component.');
          	// TODO: dereference the string and verify that the objectId exists.
          }
        }
      }
    },

    /**
     * Private method for recursively indexing the data section of a blueprint object.
     *
     * @param json {var} The current data json segment.
     * @return {void} 
     */
    __processJsonDataWorker : function(json) {},


    /**
     * Private method for indexing the scripts section of a blueprint object.
     *
     * @param json {var} The scripts json segment.
     * @return {void} 
     */
    __processJsonScriptsWorker : function(json) {},


    /**
     * Private method for indexing the functions section of a blueprint object.
     *
     * @param json {var} The function json segment.
     * @return {void} 
     */
    __processJsonFunctionsWorker : function(json) {},


    /**
     * Private method for indexing the controllers section of a blueprint object.
     *
     * @param json {var} The data json segment.
     * @return {void} 
     */
    __processJsonControllersWorker : function(json) {},


    /**
     * Private method for indexing the bindings section of a blueprint object.
     *
     * @param json {var} The bindings json segment.
     * @return {void} 
     */
    __processJsonBindingsWorker : function(json) {},


    /**
     * Private method for indexing the events section of a blueprint object.
     *
     * @param json {var} The events json segment.
     * @return {void} 
     */
    __processJsonEventsWorker : function(json) {},


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
    __carefullyCreateTopKeys : function(json)
    {
      var c = designer.core.manager.Abstract;

      for (var key=0; key<c.__TOP_CONTAINER_OBJECTS.length; key++)
      {
        if (!qx.lang.Type.isObject(json[c.__TOP_CONTAINER_OBJECTS[key]]))
        {
          //this.warn("{} ==> creating " + c.__TOP_CONTAINER_OBJECTS[key]);
          json[c.__TOP_CONTAINER_OBJECTS[key]] = {};
        }
      }

      for (var key=0; key<c.__TOP_CONTAINER_ARRAYS.length; key++)
      {
        if (!qx.lang.Type.isArray(json[c.__TOP_CONTAINER_ARRAYS[key]]))
        {
          //this.warn("[] ==> creating " + c.__TOP_CONTAINER_ARRAYS[key]);
          json[c.__TOP_CONTAINER_ARRAYS[key]] = [];
        }
      }
    }
  }
});