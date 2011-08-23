qx.Mixin.define("designer.util.MDeafener",
{
	construct : function() {
		this.removeAllListeners();
	},
	
	members :
	{
		/**
		* Removes all listeners from an object and its child components.
		*
		* @return {void} 
		*/
		removeAllListeners : function() {
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
			
			if (qx.lang.Type.isFunction(this.postDeafening)) {
				this.postDeafening();
			}
		}
	}
});