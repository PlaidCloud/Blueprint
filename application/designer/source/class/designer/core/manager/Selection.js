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
		changeSelection: "qx.event.type.Data",
		propertiesUpdated: "qx.event.type.Data"
	},

	properties : {
		selection : {
			check : "qx.ui.core.LayoutItem",
			event : "changeSelection",
			apply : "_applySelection",
			nullable : true,
			init : null
		},
		
		popup : {
			check : "designer.ui.SelectionPopup"
		}
	},

	members :
	{
		__checkLayoutParents : function(obj) {
			if (obj instanceof qx.ui.tabview.Page) {
				var tabview = obj.getLayoutParent().getLayoutParent();
				tabview.setSelection([obj]);
			}
			
			if (qx.lang.Type.isFunction(obj.getLayoutParent) && obj.getLayoutParent()) {
				this.__checkLayoutParents(obj.getLayoutParent());
			}
		},
		
		_applySelection : function(value, old) {
			if (value) {
				this.__checkLayoutParents(value);
				this.showSelectionPopup(value);
			} else {
				this.getPopup().hide();
				this.getPopup().setTarget(null);
			}
		},
		
		showSelectionPopup : function(selection) {
			this.getPopup().setTarget(selection);
		},
		
		clearSelection : function() {
			designer.core.manager.Selection.getInstance().setSelection(null);
		},
		
		propertiesUpdated : function() {
			this.fireEvent("propertiesUpdated", qx.event.type.Data, [designer.core.manager.Selection.getInstance().getSelection()]);
		}
	}
});