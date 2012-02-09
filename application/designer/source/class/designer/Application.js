/* ************************************************************************

	 Copyright:

	 License:

	 Authors:

************************************************************************ */

/* ************************************************************************

#asset(designer/*)
#asset(fugue/icons/*)

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
		__appToolBarItems : null,
		_tabview: null,
		_toolbar: null,
		_appcontrols: null,
		
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
		main : function() {
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
			
			this._appcontrols = {};
			
			this._toolbar = new qx.ui.toolbar.ToolBar();
            var doc = this.getRoot();
			
			doc.add(this._toolbar, {top: 2, right: 2, left: 2});
			this.__buildAppMenuItems();
			
			this.setDialogManager(new designer.core.manager.Dialog());
			
			designer.util.Schema.getInstance().init("blueprint");
			
			
			var manager = designer.core.manager.Blueprint.getInstance();
			
			this.setManager(manager);
			manager.loadJson();
			
			var doc = this.getRoot();
			
			this._tabview = new designer.ui.TabView();
			var layoutPage = new designer.ui.tabview.page.Layout();
			var formPage = new designer.ui.tabview.page.Form();
			var scriptsPage = new designer.ui.tabview.page.Scripts();
			var jsonPage = new designer.ui.tabview.page.Json();
			this._tabview.add(layoutPage);
			this._tabview.add(formPage);
			this._tabview.add(scriptsPage);
			this._tabview.add(jsonPage);
			
			manager.setLayoutPage(layoutPage);
			manager.setFormPage(formPage);
			manager.setJsonPage(jsonPage);
			this._tabview.setSelection([layoutPage]);
			
			this._tabview.addListener("changeSelection", this.rebuildMenus, this);
			doc.add(this._tabview, {top: 32, right: 2, bottom: 2, left: 2});
		},
		
		__buildAppMenuItems : function() {
			this.__appToolBarItems = [];
			
			this.__appToolBarItems.push(new qx.ui.toolbar.Button("AppButton 1"));
			this.__appToolBarItems.push(new qx.ui.toolbar.Button("AppButton 2"));
			this.__appToolBarItems.push(new qx.ui.toolbar.Button("AppButton 3"));
			this.__appToolBarItems.push(new qx.ui.toolbar.Separator());
			
			this._toolbar.removeAll();
			
			for (var i=0;i<this.__appToolBarItems.length;i++) {
				this._toolbar.add(this.__appToolBarItems[i]);
			}
			
			this.rebuildMenus();
		},
		
		rebuildMenus : function() {
			var children = this._toolbar.getChildren();
			
			for (var i=0;i<children.length;i++) {
				if (!qx.lang.Array.contains(this.__appToolBarItems, children[i])) {
					this._toolbar.remove(children[i]);
					i--;
				}
			}
			
			if (this._tabview && this._tabview.getSelection().length == 1) {
				var tab = this._tabview.getSelection()[0];
				var buttons = tab.getTabButtons();
				
				for (var i=0;i<buttons.length;i++) {
					this._toolbar.add(buttons[i]);
				}
			}
		},
		
		getAppControl : function(objName) {
			var control;
			if (this._appcontrols[objName]) { return this._appcontrols[objName]; }
			
			switch (objName) {
				case "something":
				break;
			}
			
			this._appcontrols[objName] = control;
			return control;
		},
		
		getEditContents : function(editedObj) {
			var funct;
			
			switch (editedObj.classname) {
				// edit content overrides go here if needed.
			}
			
			return funct || editedObj.editContents;
		}
	}
});
