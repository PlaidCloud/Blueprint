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

qx.Class.define("designer.ui.ScriptsPage", {
	extend: qx.ui.tabview.Page,
	
	construct: function() {
		this.base(arguments, "Functions");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: "north"});
		
		var buttonthatdoesnothing = new qx.ui.toolbar.Button("I do nothing");
		toolbar.add(buttonthatdoesnothing);
		
		var saveFunctionButton = new qx.ui.toolbar.Button("Save Function");
		toolbar.add(saveFunctionButton);
		
		saveFunctionButton.addListener("execute", function(e) {
			if (this.functionsList.getSelection() && this.functionsList.getSelection().getGeneratedId()) {
				var gid = this.functionsList.getSelection().getGeneratedId();
				if (this.editor.getCode()) {
					var code = this.editor.getCode().replace(/\"/g, "\\\"").split("\n");
					qx.core.Init.getApplication().getManager().setFunctionBody(gid, code);
					var args = this.argsbox.getArgs();
					qx.core.Init.getApplication().getManager().setFunctionArgs(gid, args);
				}
			}
			
		}, this);
		
		var container = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(container, {edge: "center"});
		
		var pane = new qx.ui.splitpane.Pane("horizontal");
		container.add(pane);
		
		var paneLeft = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
			width: 400
		});
		pane.add(paneLeft, 0);
		
		this.functionsList = new designer.ui.script.FunctionsList();
		paneLeft.add(this.functionsList);
		
		var paneRight = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		pane.add(paneRight, 1);
		
		var paneRightPane = new qx.ui.splitpane.Pane("vertical");
		paneRight.add(paneRightPane);
		
		var paneRightPaneTop = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		paneRightPane.add(paneRightPaneTop, 0);
		
		//var placeholder = new qx.ui.basic.Label("Args go here.");
		//paneRightPaneTop.add(placeholder);
		this.argsbox = new designer.ui.script.ArgsBox();
		paneRightPaneTop.add(this.argsbox);
		
		var paneRightPaneBottom = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		paneRightPane.add(paneRightPaneBottom, 1);
		
		this.editor = new designer.ui.editor.Editor();
		this.editor.init("", "javascript");
		paneRightPaneBottom.add(this.editor);

		this.functionsList.setEditor(this.editor);
		this.functionsList.setArgsbox(this.argsbox);
	}
});
