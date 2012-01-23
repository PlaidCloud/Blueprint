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
qx.Class.define("designer.ui.page.Json", {
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
		
		this.jsonEditor = new designer.ui.editor.Editor();
		this.jsonEditor.init("Document");
		paneTop.add(this.jsonEditor);
		
		var errorScroll = new designer.ui.ErrorScroll().set({
			"jsonEditor": this.jsonEditor
		});
		paneBottom.add(errorScroll);
		
		this.addListener("appear", function(e) {
			if (this._reload) {
				this._oldCode = qx.lang.Json.stringify(qx.core.Init.getApplication().getManager().exportJson(), null, '\t');
				this.jsonEditor.setCode(this._oldCode);
			} else {
				this._reload = true;
			}
			this.jsonEditor.finishLoading();
		}, this);
		
		reformatButton.addListener("execute", function(e) {
			var json = qx.lang.Json.parse(this.jsonEditor.getCode());
			this.jsonEditor.setCode(qx.lang.Json.stringify(json, null, '\t'));
		}, this);
		
		validateButton.addListener("execute", function(e) {
			errorScroll.clear();
			try {
				var json = jsonlint.parse(this.jsonEditor.getCode());
			} catch (e) {
				errorScroll.addTextError(e.message, [parseInt(/\d+/.exec(e.message)), -1]);
			}
			var schematext = designer.util.Schema.getInstance().getSchematext();
			var schema = jsonlint.parse(schematext);
			var env = JSV.createEnvironment();
			var report = env.validate(json, schema);
			
			if (report.errors.length !== 0)  {
				for (var i=0; i<report.errors.length; i++) {
					errorScroll.addError(this.jsonEditor.getCode(), schematext, report.errors[i]);
				}
			}
			try {
				var results = designer.util.JsonError.validateObjectIds(json);
				for (var id in results[1]) {
					if (results[1][id] != undefined) {
						errorScroll.addUndeclaredIdError(this.jsonEditor.getCode(), id, results[1][id]["path"]);
					}
				}
			} catch (e) {
				if (e.message == "Duplicate objectId") {
					errorScroll.addDuplicateIdError(this.jsonEditor.getCode(), e);
				} else if (e.message == "Not a form") {
					errorScroll.addFormError(this.jsonEditor.getCode(), e);
				} else {
					throw(e);
				}
			}
			errorScroll.noErrors();
		}, this);
	},
	
	members: {
		_reload: true,
		importJson: function() {
			qx.core.Init.getApplication().getManager().importTopContainer(designer.util.JsonError.validate(this.jsonEditor.getCode()));
		},
		update: function() {
			if (this._oldCode != this.jsonEditor.getCode()) {
				try {
					var that = this;
					designer.util.JsonError.validate(this.jsonEditor.getCode())
					designer.util.Misc.plaidAlert({
						"message": "The json has changed. Do you want to import the changes?",
						"caption": "Alert",
						"button1message": "Discard changes.",
						"button1function": function (e) {
							this.close();
						},
						"button2message": "Import changes.",
						"button2function": function (e) {
							that.importJson();
							this.close();
						}
					});
				} catch (e) {
					var that = this;
					designer.util.Misc.plaidAlert({
						"message": "The json has changed, but does not validate. Do you want to edit the json?",
						"caption": "Alert",
						"button1message": "Discard changes.",
						"button1function": function (e) {
							this.close();
						},
						"button2message": "Edit json.",
						"button2function": function (e) {
							that._reload = false;
							that.getLayoutParent().getLayoutParent().setSelection([that]);
							this.close();
						}
					});
				}
			}
		}
	}
});
