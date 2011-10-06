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

/* **********************************************

#ignore(jsonlint)
#ignore(JSV)

********************************************** */

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
			height: 400
		});
		pane.add(paneTop, 0);
		
		var paneBottom = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
			decorator: "main"
		});
		pane.add(paneBottom, 1);
		
		var jsonEditor = new designer.ui.editor.Editor();
		jsonEditor.init("Document");
		paneTop.add(jsonEditor);
		
		var errorScroll = new designer.ui.ErrorScroll().set({
			"jsonEditor": jsonEditor
		});
		paneBottom.add(errorScroll);
		
		this.addListener("appear", function(e) {
			
		});
		reformatButton.addListener("execute", function(e) {
			var json = qx.lang.Json.parse(jsonEditor.getCode());
			jsonEditor.setCode(qx.lang.Json.stringify(json, null, '\t'));
		});
		validateButton.addListener("execute", function(e) {
			errorScroll.clear();
			try {
				var json = jsonlint.parse(jsonEditor.getCode());
			} catch (e) {
				errorScroll.addTextError(e.message, [parseInt(/\d+/.exec(e.message)), -1]);
			}
			var schematext = '{}'
			var schema = jsonlint.parse(schematext);
			var env = JSV.createEnvironment();
			var report = env.validate(json, schema);
			
			if (report.errors.length === 0) {
				//errorScroll.noErrors();
			} else {
				for (var i=0; i<report.errors.length; i++) {
					errorScroll.addError(jsonEditor.getCode(), schematext, report.errors[i]);
				}
			}
			try {
				var results = designer.util.JsonError.validateObjectIds(json);
				for (var id in results[1]) {
					if (results[1][id] != undefined) {
						errorScroll.addUndeclaredIdError(jsonEditor.getCode(), id, results[1][id]["path"]);
					}
				}
			} catch (e) {
				if (e.message == "Duplicate objectId") {
					errorScroll.addDuplicateIdError(jsonEditor.getCode(), e);
				} else if (e.message == "Not a form") {
					errorScroll.addFormError(jsonEditor.getCode(), e);
				} else {
					this.debug(qx.lang.Json.stringify(e, null, '\t'));
					throw(e);
				}
			}
			errorScroll.noErrors();
		});
	}
});
