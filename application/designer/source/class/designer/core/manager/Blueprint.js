qx.Class.define("designer.core.manager.Blueprint",
{
  extend : designer.core.manager.Abstract,
  type : "singleton",

  construct : function() {
    this.base(arguments);
  },

  members :
  {
    /**
     * TODOC
     *
     * @return {void} 
     */
    loadJson : function()
    {
      var request = new qx.io.remote.Request("resource/designer/examples/Table.json");

      request.addListener("completed", this.__processJson, this);

      request.send();
    }
  }
});