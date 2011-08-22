qx.Class.define("designer.core.manager.Selection",
{
  extend : qx.core.Object,
  type : "singleton",

  construct : function() {
    this.base(arguments);
  },
  
  events : {
	/**
     * Fired when the selection changes.
     */
    changeSelection: "qx.event.type.Data"
  },

  properties : {
  	selection : {
  		check : "qx.ui.core.LayoutItem",
  		apply : "_applySelection",
  		event : "changeSelection",
  		nullable : true,
  		init : null
  	}
  },

  members :
  {
    __valueDecorator : null,
    
    /**
     * TODOC
     *
     * @return {void} 
     */
    _applySelection : function(value, old) {
    	this.debug("Selected: " + value + " // old value: " + old);
    }
  }
});