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
    _json : null,
    _objects : null,
    _objectIds : null,
    

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
		
		return 0;
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
      
      this.__processJsonLayoutWorker(this._json.layout);
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
    __processJsonLayoutWorker : function(json, layoutmap)
    {
      var generatedId = this.__objectCounter++;
      this._objects[generatedId] = json;

      if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
        this._objectIds[json.objectId] = json;
      }

      // Create the designer indexing object. All object specific data will go here.
      blueprint.util.Misc.setDeepKey(json, [ "__designer", "generatedId" ], generatedId);
      if (layoutmap) {
        blueprint.util.Misc.setDeepKey(json, [ "__designer", "layoutmap" ], layoutmap);
      }

      // recurse through the valid objects for processing
      if (qx.lang.Type.isArray(json.contents))
      {
        for (var i=0; i<json.contents.length; i++) {
          this.__processJsonLayoutWorker(json.contents[i].object, json.contents[i].layoutmap);
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