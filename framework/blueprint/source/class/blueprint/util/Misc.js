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

/**
* This object is a collection of miscellaneous functions.
*/
qx.Bootstrap.define("blueprint.util.Misc", {
	type: "static",

	statics: {
		/**
		* A map of strings to qooxdoo layout objects.
		*/
		layouts : {
			'qx.ui.layout.Canvas': qx.ui.layout.Canvas,
			'qx.ui.layout.Dock': qx.ui.layout.Dock,
			'qx.ui.layout.Grid': qx.ui.layout.Grid,
			'qx.ui.layout.Grow': qx.ui.layout.Grow,
			'qx.ui.layout.HBox': qx.ui.layout.HBox,
			'qx.ui.layout.VBox': qx.ui.layout.VBox
		},
		

		/**
		* Takes two json objects and applies the properties of the second
		* object to the first one. This is a shallow copy of those properties.
		* Use with care.
		*
		* @param base_json {Object}
		*   The JSON object which will be written to.
		* @param override_json {Object}
		*   The JSON object which will be copied from.
		* @return {Object}
		*   The base_json object with values from override_json applied.
		*/
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

		/**
		* This function transforms the arguments object passed into a
		* blueprint event into the correct javascript objects.
		* It scans the arguments array passed in and replaces objects with a
		* specific format with references to qooxdoo objects.
		* See {@link blueprint.util.Misc#buildListener} for an example.
		*
		* @param argsObj {Array}
		*   The JSON object which will be written to.
		* @param namespace {String}
		*   The string name used to look up all objectIDs referenced in the
		*   listener.
		* @return {Array}
		*   The args array with string references resolved to point to qx objects.
		*/
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

		/**
		* This function builds and returns listener function for a blueprint
		* event. An example event object looks like this:
		* <pre>
		{
			"eventFunct": {
				"eventArgs": ["New Window Caption"],
				"eventFunct": "setCaption",
				"eventObj": "window"
			},
			"eventName": "execute",
			"sourceId": "btnRenameWindow"
		}
		* </pre>
		* The sourceId is the objectId of the object to attach the event to.
		* The event name is the name of the event (see qx docs for listings.)
		* The eventFunct object contains at least an eventObj and eventFunct
		* object with an optional eventArgs array. eventFunct objects are
		* nestable within eventArgs arrays if desired.
		*
		* @param functionObj {Object}
		*   A qooxdoo object to attach the event to. The event is also run
		*   with that object as the context object.
		* @param namespace {String}
		*   The string name used to look up all objectIDs referenced in the
		*   listener.
		* @return {Function} 
		*   The function that will be called when the event occurs.
		*/
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

		/**
		* Takes a json object and stringifies then parses it, producing a
		* deep copy of the object. Be careful with this function;
		* passing a complicated object or an object with a cyclical
		* reference will result in a freeze or crash.
		*
		* @param json {Object}
		*   The JSON object which will be copied.
		* @return {Object}
		*   A copy of the json object.
		*/
		copyJson: function(json) {
			return qx.lang.Json.parse(qx.lang.Json.stringify(json));
		},

		/**
		* Takes a string and returns the specified instantiation of a
		* qooxdoo layout. This method should be deprecated eventually
		* in favor of using components on the json for a blueprint object.
		*
		* @param layout_type {String}
		*   The string name for the layout.
		* @return {qx.ui.layout.Abstract}
		*   The requested layout.
		*/
		generateLayout: function(layout_type) {
			return new blueprint.util.Misc.layouts[layout_type]();
		},

		/**
		* Given a property chain, this function will attempt to return the
		*   value at the end of the chain, or undefined if no value is found.
		*   This is meant to be a safe way to check for a value multiple
		*   levels deep in a javascript object.
		*
		* @param map {Object || Array}
		*   The object to probe for a return value.
		* @param arr {Array}
		*   The array of index references to use to get a return value.
		* @param index {Number}
		*   Internal argument for tracking which index is being used.
		*   (Don't pass in index when calling this function.)
		* @return {var||undefined}
		*   The requested value or undefined.
		*/
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

		/**
		* Given a property chain, this function will attempt to set a
		*   value at the end of the chain. If any part of the chain is
		*   undefined, this function will create objects with keys for
		*   each element in the index array.
		*
		* @param map {Object || Array}
		*   The object to probe to set a deep value.
		* @param arr {Array}
		*   The array of index references used to get to the value you
		*     wish to set.
		* @param value {var}
		*   The value you wish to set at the indicated location.
		* @param index {Number}
		*   Internal argument for tracking which index is being used.
		*   (Don't pass in index when calling this function.)
		*/
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

		/**
		* This is a closure function which will apply a blueprint
		*   component. For example: A {@link blueprint.ui.table.Table}
		*   requires a {@link qx.ui.table.ITableModel} to be applied to
		*   the tableModel property. The buildComponent function returns
		*   a closure that contains the relevant variables to apply the
		*   tableModel to the table object.
		*
		* @param obj {qx.core.Object}
		*   The object that the component will be applied to.
		* @param compName {String}
		*   The objectId for the component to be applied to obj.
		* @param propName {String}
		*   The string name of the property on obj that the component
		*   will be applied to.
		* @param namespace {String}
		*   The namespace the objects belong to.
		* @return {Function}
		*   The function to be called to apply the component.
		*/
		buildComponent: function(obj, compName, propName, namespace) {
			return function() {
				var newComp = blueprint.util.Registry.getInstance().getByNamespace(namespace, compName);
				qx.core.Assert.assertNotUndefined(newComp, "Could not find a blueprint object with the objectId: " + compName + " for property " + propName + ".");
				obj.set(propName, newComp);
			};
		},

		/**
		* This function replaces the "$variable" references in the text
		*   with a blueprint function to look up the variable via the
		*   {@link blueprint.util.Registry}. This method of variable
		*   reference should be deprecated in favor of using a blueprint
		*   context object. For example, the objectId "myStuff" could be
		*   referenced in blueprint function code as (old way):
		*   <code>$myStuff</code> or (new way): <code>this.myStuff</code>.
		*   The main advantage of the new way is that it is a language
		*   feature and does not require any string processing. This
		*   function continues to exist to provide backwards compatibility
		*   with older blueprint functions.
		*
		* @param caller {qx.core.Object}
		*   A blueprint object that is a member of the namespace this
		*     function will be run in.
		* @param text {String}
		*   Text text of the function.
		* @return {String}
		*   The modified text of the function.
		*/
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
