qx.Class.define("designer.ui.TabView",
{
	extend : qx.ui.tabview.TabView,

	construct : function() {
		this.base(arguments);
		this.addListener("changeSelection", designer.core.manager.Selection.getInstance().clearSelection);
	},
	
	properties: {
		currentTab: {
			check: "String",
			init: "none"
		},
		jsonPage: {
			check: "designer.ui.JsonPage",
			nullable: true,
			init: null
		}
	}
});
