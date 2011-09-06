qx.Mixin.define("designer.util.MJson", {
  properties : {
  	generatedId : {
  		"check" : "String"
  	}
  },
  
  members: {
      layoutAdd: function(child, options) {
          this.add(child, options);
      }
  }
});
