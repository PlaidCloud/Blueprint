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
			event : "changeSelection",
			nullable : true,
			init : null
		}
	},

	members :
	{
		clearSelection : function() {
			this.setSelection(null);
		}
	}
});