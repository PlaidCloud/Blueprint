qx.Class.define("designer.core.manager.Abstract",
{
  extend : qx.core.Object,

  construct : function()
  {
    this.base(arguments);

    this._json = null;
    this._objects = {};
    this._objectIds = {};
    this.__objectCounter = 0;
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
     * TODOC
     *
     * @param e {Event} TODOC
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
    },


    /**
     * TODOC
     *
     * @param json {var} TODOC
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

          if (qx.lang.Type.isString(json.components[i])) {}
        }
      }
    },

    // TODO: dereference the string and verify that the objectId exists.
    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonDataWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonScriptsWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonFunctionsWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonControllersWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonBindingsWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
     * @return {void} 
     */
    __processJsonEventsWorker : function(json) {},


    /**
     * TODOC
     *
     * @param json {var} TODOC
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