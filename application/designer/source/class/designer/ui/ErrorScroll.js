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


/** TODOC
 */
qx.Class.define("designer.ui.ErrorScroll", {
	extend: qx.ui.container.Scroll,

	construct: function() {
		this.base(arguments);
		this.__composite = new qx.ui.container.Composite(new qx.ui.layout.VBox());
		this.add(this.__composite);
	},

	properties: {
		jsonEditor: {
			check: "designer.ui.editor.Editor",
			nullable: true,
			init: null
		},
		schemaEditor: {
			check: "designer.ui.editor.Editor",
			nullable: true,
			init: null
		}
	},

	members: {
		__composite: null,
	
		clear: function() {
			var children = this.__composite.getChildren().slice(0);
			for (var i=0; i<children.length; i++) {
				this.__composite.remove(children[i]);
			}
		},
		
		noErrors: function() {
			if (this.__composite.getChildren().length == 0) {
				var noErrorArea = new qx.ui.form.TextArea().set({
					font: qx.bom.Font.fromString("14px monospace"),
					readOnly: true,
					value: "No errors."
				});
				this.__composite.add(noErrorArea);
			}
		},
		
		addError: function(json, schema, error) {
			var h = designer.util.JsonError.humanitize(json, schema, error);
			var m = h[0];
			var j = h[1];
			var s = h[2];
			var errorArea = new qx.ui.form.TextArea().set({
				font: qx.bom.Font.fromString("14px monospace"),
				readOnly: true,
				value: m
			});
			errorArea.addListener("click", this.errorFactory(j, s), this);
			this.__composite.add(errorArea);
		},
		
		addTextError: function(m, j, s) {
			if (j === null || j === undefined) {
				j = [-1, -1];
			}
			if (s === null || s === undefined) {
				s = [-1, -1];
			}
			var errorArea = new qx.ui.form.TextArea().set({
				font: qx.bom.Font.fromString("14px monospace"),
				readOnly: true,
				value: m
			});
			errorArea.addListener("click", this.errorFactory(j, s), this);
			this.__composite.add(errorArea);
		},
		
		addDuplicateIdError: function(json, error) {
			var j1 = designer.util.JsonError.normalizeCoords(designer.util.JsonError.findLineByPath(json.split('\n'), error.originalPath));
			var j2 = designer.util.JsonError.normalizeCoords(designer.util.JsonError.findLineByPath(json.split('\n'), error.duplicatePath)); 
			var m = "The objectId " + error.id + " is defined twice, once near j" + j1 + " and once near j" + j2 + ".";
			var errorArea = new qx.ui.form.TextArea().set({
				font: qx.bom.Font.fromString("14px monospace"),
				readOnly: true,
				value: m
			});
			errorArea.addListener("click", this.errorFactory(j1, [-1, -1]), this);
			this.__composite.add(errorArea);
		},
		
		addFormError: function(json, error) {
			var j1b = designer.util.JsonError.findLineByPath(json.split('\n'), error.decPath)
			var j2a = designer.util.JsonError.findLineByPath(json.split('\n'), error.refPath.slice(0, -1));
			var j2b = designer.util.JsonError.normalizeCoords(designer.util.JsonError.findLineOfProperty(json.split('\n'), error.refPath[error.refPath.length-1], j2a[0], j2a[1]));
			var m = "The reference near " + j2b + " expects a form, but " + error.id + ", declared near " + j1b +", is of class " + error.decClass + ".";
			var errorArea = new qx.ui.form.TextArea().set({
				font: qx.bom.Font.fromString("14px monospace"),
				readOnly: true,
				value: m
			});
			errorArea.addListener("click", this.errorFactory(j2b, [-1, -1]), this);
			this.__composite.add(errorArea);
		},
		
		addUndeclaredIdError: function(json, id, path) {
			var j1 = designer.util.JsonError.findLineByPath(json.split('\n'), path.slice(0, -1));
			var j2 = designer.util.JsonError.normalizeCoords(designer.util.JsonError.findLineOfProperty(json.split('\n'), path[path.length-1], j1[0], j1[1]));
			var m = "The objectId \"" + id + "\" is referenced near j" + j2 + " but is never declared.";
			var errorArea = new qx.ui.form.TextArea().set({
				font: qx.bom.Font.fromString("14px monospace"),
				readOnly: true,
				value: m
			});
			errorArea.addListener("click", this.errorFactory(j2, [-1, -1]), this);
			this.__composite.add(errorArea);
		},
		
		errorFactory: function(j, s) {
			return function(e) {
				if (this.getJsonEditor() && j[0] >= 0) {
					this.getJsonEditor().gotoLine(j[0]);
				}
				if (this.getSchemaEditor() && s[0] >= 0) {
					this.getSchemaEditor().gotoLine(s[0]);
				}
			}
		}
	},

	destruct: function() {
	}
});
