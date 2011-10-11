/* ************************************************************************

	 Copyright:

	 License:

	 Authors:

************************************************************************ */

/* ************************************************************************

#asset(designer/*)

************************************************************************ */

qx.Class.define("designer.Application",
{
	extend : qx.application.Standalone,
	
	properties :
	{
		manager :
		{
			check : "designer.core.manager.Abstract"
		},
		dialogManager: {
			check: "designer.core.manager.Dialog"
		}
	},

	members :
	{
		_tabview: null,
		modalOn: function() {
			if (this._tabview) {
				this._tabview.setOpacity(0.5);
			}
		},
		modalOff: function() {
			if (this._tabview) {
				this._tabview.setOpacity(1);
			}
		},
		/**
		 * This method contains the initial application code and gets called 
		 * during startup of the application
		 *
		 * @return {void} 
		 */
		main : function()
		{
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug"))
			{
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;

				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
			}
			
			this.setDialogManager(new designer.core.manager.Dialog());
			
			designer.util.Schema.getInstance().init("blueprint");
			
			
			var manager = designer.core.manager.Blueprint.getInstance();
			
			this.setManager(manager);
			manager.loadJson();
			
			var doc = this.getRoot();
			
			this._tabview = new designer.ui.TabView();
			var layoutPage = new designer.ui.LayoutPage();
			var formPage = new designer.ui.FormPage();
			var jsonPage = new designer.ui.JsonPage();
			this._tabview.add(layoutPage);
			this._tabview.add(formPage);
			this._tabview.add(jsonPage);
			this._tabview.setJsonPage(jsonPage);
			
			manager.setLayoutPage(layoutPage);
			
			doc.add(this._tabview, {top: 2, right: 2, bottom: 2, left: 2});
			
			manager.addListener("jsonLoaded", function(e) {
				//var selector = new designer.selector.Int("obj1", "width");
				//doc.add(selector);
			
				//selector.show();
			});
		}
	}
});
