qx.Class.define("designer.ui.TabView",
{
	extend : qx.ui.tabview.TabView,

	construct : function() {
		this.base(arguments);

		this.addListener("changeSelection", designer.core.manager.Selection.getInstance().clearSelection);
		this.addListener("changeSelection", this.__changeSelection);
	},
	
	members: {
		__changeSelection : function(e) {
			var jsonPage = qx.core.Init.getApplication().getManager().getJsonPage();
			if (jsonPage && e.getData()[0] != jsonPage) {
				jsonPage.update();
			}
		}
	}
});
