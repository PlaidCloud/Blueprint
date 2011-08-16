qx.Mixin.define("designer.util.MDeafener",
{
  construct : function() {
    this.removeAllListeners();
  },
  
  properties : {},

  members :
  {
    /**
     * TODOC
     *
     * @return {void} 
     */
    removeAllListeners : function()
    {
      var listeners = qx.event.Registration.serializeListeners(this);

      for (var i=0; i<listeners.length; i++) {
        this.removeListener(listeners[i].type, listeners[i].handler);
      }

      var childControls = this._getCreatedChildControls() || [];

      for (var i in childControls)
      {
        var childListeners = qx.event.Registration.serializeListeners(childControls[i]);

        for (var j=0; j<childListeners.length; j++) {
          childControls[i].removeListener(childListeners[j].type, childListeners[j].handler);
        }
      }
    }
  },

  destruct : function() {}
});