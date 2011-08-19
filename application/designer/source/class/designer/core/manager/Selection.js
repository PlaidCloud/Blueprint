qx.Class.define("designer.core.manager.Selection",
{
  extend : qx.core.Object,
  type : "singleton",

  construct : function() {
    this.base(arguments);
  },

  properties : {
  	selection : {
  		check : "qx.ui.core.LayoutItem",
  		apply : "_applySelection",
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
    	/*
    	if (old && qx.lang.Type.isFunction(old.setDecorator)) {
	    	old.setDecorator(this.__valueDecorator);
	    	this.__valueDecorator = null;
    	}
    
		if (qx.lang.Type.isFunction(value.getDecorator) && qx.lang.Type.isFunction(value.setDecorator)) {
			this.__valueDecorator = value.getDecorator()
			value.setDecorator("main");
    	} else {
			this.__valueDecorator = null;
    	}
    	*/
    }
  }
});