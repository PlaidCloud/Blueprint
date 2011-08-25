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
			apply : "_applySelection",
			nullable : true,
			init : null
		}
	},

	members :
	{
		_applySelection : function(value, old) {
			this.debug("selectinatto: " + value);
			
			if (value) {
				this.__checkLayoutParents(value);
			}
		},
		
		__checkLayoutParents : function(obj) {
			if (obj instanceof qx.ui.tabview.Page) {
				var tabview = obj.getLayoutParent().getLayoutParent();
				tabview.setSelection([obj]);
			}
			
			if (qx.lang.Type.isFunction(obj.getLayoutParent) && obj.getLayoutParent()) {
				this.__checkLayoutParents(obj.getLayoutParent());
			}
		},
		
		clearSelection : function() {
			designer.core.manager.Selection.getInstance().setSelection(null);
		}
	}
});