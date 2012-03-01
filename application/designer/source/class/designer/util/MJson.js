qx.Mixin.define("designer.util.MJson", {
	properties : {
		generatedId : {
			"check" : "String"
		}
	},

	construct: function() {
		this.setDroppable(true);
		this.addListener("drop", function(e) {
			var clazz = e.getData("designer/object")[0];
			var id = e.getData("designer/object")[1];
			qx.core.Init.getApplication().getManager().requestNewObject(clazz, this.getGeneratedId(), id);
		});
	},
  
	members: {
		layoutAdd: function(child, options) {
			this.add(child, options);
		}
	}
});
