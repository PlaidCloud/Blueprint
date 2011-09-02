qx.Mixin.define("designer.util.MJson", {
  properties : {
  	generatedId : {
  		"check" : "String"
  	}
  },
  
  members: {
      layoutAdd: function() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
              args.push(arguments[i]);
          }
          this.add.apply(args);
      }
  }
});
