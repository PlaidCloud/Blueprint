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

/** TODO doc
 */
qx.Class.define("designer.ui.JsonPage", {
	extend: qx.ui.tabview.Page,
	
	construct: function() {
		this.base(arguments, "JSON");
		this.setPadding(2);
		this.setLayout(new qx.ui.layout.Dock());
		
		var reformatButton = new qx.ui.toolbar.Button("Reformat");
		var validateButton = new qx.ui.toolbar.Button("Validate");
		
		var toolbar = new qx.ui.toolbar.ToolBar();
		this.add(toolbar, {edge: "north"});
		toolbar.add(reformatButton);
		toolbar.add(validateButton);
		
		var container = new qx.ui.container.Composite(new qx.ui.layout.Grow());
		this.add(container, {edge: "center"});
		
		var pane = new qx.ui.splitpane.Pane("vertical");
		container.add(pane);
		
		var paneTop = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
			height: 400,
			decorater: "main"
		});
		pane.add(paneTop, 0);
		
		var paneBottom = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
			decorator: "main"
		});
		pane.add(paneBottom, 1);
		
		var jsonEditor = new designer.ui.editor.Editor();
		jsonEditor.init("Document");
		paneTop.add(jsonEditor);
		
		var errorScroll = new qx.ui.basic.Label("ErrorScroll goes here");
		paneBottom.add(errorScroll);
	}
});
