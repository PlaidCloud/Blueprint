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
		
		this.editor = new designer.ui.editor.Editor();
		this.editor.init("", "javascript");
		paneRight.add(this.editor);

		this.functionsList.setEditor(this.editor);
	}
});
