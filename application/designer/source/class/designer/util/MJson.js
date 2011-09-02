qx.Mixin.define("designer.util.MJson", {
  properties : {
  	generatedId : {
  		"check" : "String"
  	}
  },
  
  members: {
      layoutAdd: function(child, options) {
          /*var args = [];
          for (var i = 0; i < arguments.length; i++) {
              args.push(arguments[i]);
          }
          this.add.apply(this, args);*/
          
          this.debug("Adams, MJson, Adding " + child.getGeneratedId() + " to " + this.getGeneratedId());
          
          this.add(child, options);
      }
  }
});
