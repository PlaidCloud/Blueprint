qx.Class.define("designer.ui.tabview.TabView",
{
	extend : qx.ui.tabview.TabView,

	construct : function() {
		this.base(arguments);

		this.addListener("changeSelection", designer.core.manager.Selection.getInstance().clearSelection);
		this.addListener("changeSelection", this.__changeSelection);
		this.__previousTab = null;
	},
	
	members: {
		__previousTab : null,
		
		__changeSelection : function(e) {
			var newPage = e.getData()[0];
			var jsonPage = qx.core.Init.getApplication().getManager().getJsonPage();
			if (jsonPage && this.__previousTab == jsonPage && newPage != jsonPage) {
				jsonPage.update();
			}
			
			this.__previousTab = newPage;
		}
	}
});
