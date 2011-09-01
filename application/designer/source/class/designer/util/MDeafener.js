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
			/*var listeners = qx.event.Registration.serializeListeners(this);
			
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
			}*/
			
			this.__removeAllListenersWorker(this);
			
			if (qx.lang.Type.isFunction(this.postDeafening)) {
				this.postDeafening();
			}
		},
		
		__removeAllListenersWorker: function(object) {
		    var listeners = qx.event.Registration.serializeListeners(object);
		    
		    for (var i=0; i<listeners.length; i++) {
		        object.removeListener(listeners[i].type, listeners[i].handler);
		    }
		    
		    if (qx.lang.Type.isFunction(object._getCreatedChildControls)) {
		        var childControls = object._getCreatedChildControls() || [];
		        
		        for (var i in childControls) {
		            this.__removeAllListenersWorker(childControls[i]);
		        }
		    }  
		}
	}
});
