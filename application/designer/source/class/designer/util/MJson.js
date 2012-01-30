qx.Mixin.define("designer.util.MJson", {
    properties : {
  	    generatedId : {
  		    "check" : "String"
  	    }
    },

    construct: function() {
        this.setDroppable(true);
        this.addListener("drop", function(e) {
            var clazz = e.getData("designer/object");
            this.debug("A new " + clazz + " dropped on " + this.getGeneratedId());
        });
    },
  
    members: {
        layoutAdd: function(child, options) {
            this.add(child, options);
        }
    }
});
