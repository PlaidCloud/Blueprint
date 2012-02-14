/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Adams Tower
*/

qx.Class.define("designer.ui.tabview.page.Functions", {
	extend: designer.ui.tabview.page.Abstract,
	
	construct: function() {
		this.base(arguments, "Functions");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: "north"});
		
		var container = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(container, {edge: "center"});
		
		var pane = new qx.ui.splitpane.Pane("horizontal");
		container.add(pane);
		
		var paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
			width: 400
		});
		pane.add(paneLeft, 0);
		
		this.functionsList = new designer.ui.functions.FunctionsList();
		paneLeft.add(this.functionsList);
		
		var paneRight = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		pane.add(paneRight, 1);
		
		var paneRightPane = new qx.ui.splitpane.Pane("vertical");
		paneRight.add(paneRightPane);
		
		var paneRightPaneTop = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		paneRightPane.add(paneRightPaneTop, 0);
		
		this.argsbox = new designer.ui.functions.ArgsBox();
		paneRightPaneTop.add(this.argsbox);
		
		var paneRightPaneBottom = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		paneRightPane.add(paneRightPaneBottom, 1);
		
		this.__editor = new designer.ui.editor.Editor();
		this.__editor.init("", "javascript");
		paneRightPaneBottom.add(this.__editor);

		this.functionsList.setEditor(this.__editor);
		this.functionsList.setArgsbox(this.argsbox);
		
		this._newFunctionWindow = new designer.ui.functions.NewFunctionWindow(this.functionsList)
		
		var newFunctionButton = new qx.ui.toolbar.Button("New Function");
		toolbar.add(newFunctionButton);
		
		newFunctionButton.addListener("execute", function(e) {
			this._newFunctionWindow.show();
		}, this);
		
		var saveFunctionButton = new qx.ui.toolbar.Button("Save Function");
		toolbar.add(saveFunctionButton);
		
		saveFunctionButton.addListener("execute", function(e) {
			if (this.functionsList.getSelection() && this.functionsList.getSelection().getGeneratedId()) {
				var gid = this.functionsList.getSelection().getGeneratedId();
				if (this.__editor.getCode()) {
					var code = this.__editor.getCode().split("\n");
					qx.core.Init.getApplication().getManager().setFunctionBody(gid, code);
					var args = this.argsbox.getArgs();
					qx.core.Init.getApplication().getManager().setFunctionArgs(gid, args);
				}
			}
		}, this);
		
		var deleteFunctionButton = new qx.ui.toolbar.Button("Delete Function");
		toolbar.add(deleteFunctionButton);
		
		deleteFunctionButton.addListener("execute", function(e) {
			if (this.functionsList.getSelection() && this.functionsList.getSelection().getGeneratedId()) {
				var gid = this.functionsList.getSelection().getGeneratedId();
				qx.core.Init.getApplication().getManager().deleteFunction(gid);
				this.functionsList.refreshFunctions();
			} else {
				this.error("No function selected for deletion.");
			}
		}, this);
	},
	
	members: {
		moveCursorTo : function(funct, row, column) {
			qx.core.Assert.assertString(funct, "Function name must be a string.");
			qx.core.Assert.assertInteger(row, "Row must be an integer.");
			qx.core.Assert.assertInteger(column, "Column must be an integer.");
			
			
		}
	}
});
