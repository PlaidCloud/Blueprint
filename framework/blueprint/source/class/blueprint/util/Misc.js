/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2009 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

qx.Bootstrap.define("blueprint.util.Misc", {
	type: "static",

	statics: {
		layouts : {
			'qx.ui.layout.Canvas': qx.ui.layout.Canvas,
			'qx.ui.layout.Dock': qx.ui.layout.Dock,
			'qx.ui.layout.Grid': qx.ui.layout.Grid,
			'qx.ui.layout.Grow': qx.ui.layout.Grow,
			'qx.ui.layout.HBox': qx.ui.layout.HBox,
			'qx.ui.layout.VBox': qx.ui.layout.VBox,
			'qx.ui.mobile.layout.HBox': qx.ui.mobile.layout.HBox,
			'qx.ui.mobile.layout.VBox': qx.ui.mobile.layout.VBox
		},
		
		combineJson: function(base_json, override_json) {
			var node, new_json = {};

			for (node in base_json) {
				new_json[node] = base_json[node];
			}
			for (node in override_json) {
				new_json[node] = override_json[node];
			}
			return new_json;
		},

		buildArgs: function(argsObj, namespace) {
			var args = qx.lang.Array.clone(argsObj);

			for (var a = 0; a < args.length; a++) {
				if (qx.lang.Type.isObject(args[a])) {
					if (qx.lang.Object.getLength(args[a]) == 1) {
						if (args[a]["eventObj"]) {
							args[a] = blueprint.util.Registry.getInstance().getByNamespace(namespace, args[a]["eventObj"]);
						}

						if (args[a]["eventFunct"]) {
							this.warn("TODO: Add support calling registered blueprint functions");
						}
					} else {
						if (args[a]["eventObj"] && args[a]["eventFunct"]) {
							var obj = blueprint.util.Registry.getInstance().getByNamespace(namespace, args[a]["eventObj"]);
							if (qx.lang.Type.isFunction(obj[args[a]["eventFunct"]])) {
								var funct = obj[args[a]["eventFunct"]];
								if (!args[a]["eventArgs"]) {
									args[a]["eventArgs"] = [];
								}
								var functArgs = blueprint.util.Misc.buildArgs(args[a]["eventArgs"], namespace);

								if (obj && funct) {
									args[a] = funct.apply(obj, functArgs);
								}
							}
						}
					}
				}
			}

			return args;
		},

		buildListener: function(functionObj, namespace) {
			return function(e) {
				var obj, funct, args;

				if (functionObj["eventObj"]) {
					obj = blueprint.util.Registry.getInstance().getByNamespace(namespace, functionObj["eventObj"]);
					funct = obj[functionObj["eventFunct"]];
				} else {
					this.warn("TODO: Add support calling registered blueprint functions");
					obj = null;
					funct = null;
				}

				if (functionObj["eventArgs"]) {
					args = blueprint.util.Misc.buildArgs(functionObj["eventArgs"], namespace);
				} else {
					args = [];
				}

				funct.apply(obj, args);
			};
		},

		copyJson: function(json) {
			return qx.lang.Json.parse(qx.lang.Json.stringify(json));
		},

		generateLayout: function(layout_type) {
			return new blueprint.util.Misc.layouts[layout_type]();
		},

		getDeepKey: function(map, arr, index) {
			if (!index) {
				index = 0;
			}
			if (arr.length > (index + 1)) {
				if (map[arr[index]] === undefined) {
					return undefined;
				} else {
					return this.getDeepKey(map[arr[index]], arr, index + 1);
				}
			} else {
				return map[arr[index]];
			}
		},

		setDeepKey: function(map, arr, value, index) {
			if (!index) {
				index = 0;
			}
			if (arr.length > (index + 1)) {
				if (map[arr[index]] === undefined) {
					map[arr[index]] = {};
				}
				this.setDeepKey(map[arr[index]], arr, value, index + 1);
			} else {
				map[arr[index]] = value;
			}
		},

		buildComponent: function(obj, compName, propName, namespace) {
			return function() {
				var newComp = blueprint.util.Registry.getInstance().getByNamespace(namespace, compName);
				qx.core.Assert.assertNotUndefined(newComp, "Could not find a blueprint object with the objectId: " + compName + " for property " + propName + ".");
				obj.set(propName, newComp);
			};
		},

		replaceVariables: function(caller, text) {
			var i, ns;
			var newText = text;
			var matches = newText.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)(:[a-zA-Z_][a-zA-Z0-9_]*)?/g);
			if (matches !== null) {
				for (i = 0; i < matches.length; i++) {
					if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\$/g, ''))) {
						if (matches[i].split(":").length == 1) {
							ns = caller.getBlueprintNamespace();
							v = matches[i];
						} else {
							ns = matches[i].split(":")[0];
							v = matches[i].split(":")[1];
						}

						newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getByNamespace(\"" + ns.replace(/\$/g, '') + "\", '" + v.replace(/\$/g, '') + "')");
					} else {
						qx.log.Logger.warn("The variable " + matches[i] + " matches blueprint function syntax, but a matching objectId was not found.");
					}
				}
			}

			matches = newText.match(/\@([a-zA-Z_][a-zA-Z0-9_]*)(:[a-zA-Z_][a-zA-Z0-9_]*)?/g);
			if (matches !== null) {
				for (i = 0; i < matches.length; i++) {
					if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\@/g, ''))) {
						var v;
						if (matches[i].split(":").length == 1) {
							ns = caller.getBlueprintNamespace();
							v = matches[i];
						} else {
							ns = matches[i].split(":")[0];
							v = matches[i].split(":")[1];
						}

						newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getFunctionByNamespace(\"" + ns.replace(/\@/g, '') + "\", '" + v.replace(/\@/g, '') + "')");
					}
				}
			}

			return newText;
		}
	}
});
