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
    __TOP_CONTAINER_ARRAYS  : [ "controllers", "bindings", "events" ]
  },

  members :
  {
    __objectCounter : null,
    _json : null,
    _objects : null,
    _objectIds : null,
    
    
    /**
     * Method for setting a property on a generated blueprint object.
     *
     * @param generatedId {String} The id of the target object.
     * @param propertyName {String} The name of the property to set.
     * @param value {String} The new value to be set.
     * @return {void} 
     */

	setProperty : function(generatedId, propertyName, value) {
		var clazz = qx.Class.getByName(this._objects[generatedId].objectClass);
		var prop;
		
		
		
	},

    /**
     * Method for getting a copy of the value of a property currently stored in the
     * blueprint json.
     *
     * @param generatedId {String} The id of the target object.
     * @param propertyName {String} The name of the property to set.
     * @return {var} A copy of the requested property.
     * Returns undefined if no value is set.
     */
	
	getProperty : function(generatedId, propertyName) {
		var obj = this._objects[generatedId];
		var prop;
		
		if (obj.qxSettings[propertyName] !== undefined) {
			prop = obj.qxSettings[propertyName];
			
			if (qx.lang.Type.isObject(prop) || qx.lang.Type.isArray(prop)) {
				return blueprint.util.Misc.copyJson(prop);
			} else {
				return prop;
			}
		}
		
		return undefined;
	},

    /**
     * Private method for processing newly loaded json. Provided as a callback
     * to a qx.ui.remote.Request. Calls a __processJson<segment> function for
     * each blueprint json area. 
     *
     * @param e {Event} Response event from a qx.ui.remote.Request.
     * @return {void} 
     */
    __processJson : function(e)
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
    __processJsonLayoutWorker : function(json)
    {
      var generatedId = this.__objectCounter++;
      this._objects[generatedId] = json;

      if (qx.lang.Type.isString(json.objectId) && json.objectId != "") {
        this._objectIds[json.objectId] = json;
      }

      // Create the designer indexing object. All object specific data will go here.
      blueprint.util.Misc.setDeepKey(json, [ "__designer", "generatedId" ], generatedId);

      // recurse through the valid objects for processing
      if (qx.lang.Type.isArray(json.contents))
      {
        for (var i=0; i<json.contents.length; i++) {
          this.__processJsonLayoutWorker(json.contents[i].object);
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