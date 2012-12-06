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
* The blueprint registry keeps track of all referenced objectIds for each
*   namespace. Each namespace also has any number of additional contexts
*   which can be used if you want to track an object without colliding
*   with the standard objectIds. Any time no context is specified, a
*   context of "general" is assumed.
*/
qx.Class.define("blueprint.util.Registry", {
	extend: qx.core.Object,
	type: "singleton",

	/**
	* Initializes the registry by creating a new index and establishing
	*   an index of reserved words for objectIds.
	*/
	construct: function() {
		this.__registry = {};
		this.__reserved = {
			"app": true
		};
	},

	members: {
		__registry: null,
		__reserved: null,

		/**
		* This function allows you to check if an objectId has been registered
		*   within a namespace.
		*
		* @param blueprintObj {qx.core.Object}
		*   A blueprint object. Used to look up which namespace to check in.
		* @param variable {String}
		*   The objectId to check.
		* @param context {String}
		*   The context to look up the objectId in. If unspecified, this will
		*     default to "general".
		* @return {Boolean}
		*   Returns true if the objectId is not undefined, false otherwise.
		*/
		check: function(blueprintObj, variable, context) {
			var ns, v;
			if (variable.split(":").length == 1) {
				if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
					ns = blueprintObj.getBlueprintNamespace();
					v = variable;
				} else {
					this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot check " + variable);
				}
			} else {
				ns = variable.split(":")[0];
				v = variable.split(":")[1];
			}

			context = context || "general";

			if (this.__registry[ns] === undefined || this.__registry[ns][context] === undefined || this.__registry[ns][context][v] === undefined) {
				return false;
			} else {
				return true;
			}
		},
		
		/**
		* This function returns true if a namespace is defined, false if not.
		*
		* @param namespace {String}
		*   The name of the namespace to be checked.
		* @return {Boolean}
		*   True if the namespace is defined; false otherwise.
		*/
		checkNamespace: function(namespace) {
			return qx.lang.Type.isObject(this.__registry[namespace]);
		},

		/**
		* This function allows you to get the value of an objectId that has
		*   been registered within a namespace.
		*
		* @param blueprintObj {qx.core.Object}
		*   A blueprint object. Used to look up which namespace to check in.
		* @param variable {String}
		*   The objectId to check.
		* @param context {String}
		*   The context to look up the objectId in. If unspecified, this will
		*     default to "general".
		* @return {var}
		*   Returns the requested variable.
		*/
		get: function(blueprintObj, variable, context) {
			context = context || "general";
			if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
				var ns, v;
				if (variable.split(":").length == 1) {
					ns = blueprintObj.getBlueprintNamespace();
					v = variable;
				} else {
					ns = variable.split(":")[0];
					v = variable.split(":")[1];
				}

				return this.__registry[ns][context][v];
			} else {
				this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + variable);
			}
		},

		/**
		* This function allows you to get the value of an objectId that has
		*   been registered within a namespace. Works exactly like
		*   {@link blueprint.util.Registry#get} but takes a String as a
		*   namespace argument rather than a blueprint object.
		*
		* @param namespace {String}
		*   The name of the namespace.
		* @param variable {String}
		*   The objectId to check.
		* @param context {String}
		*   The context to look up the objectId in. If unspecified, this will
		*     default to "general".
		* @return {var}
		*   Returns the requested variable.
		*/
		getByNamespace: function(namespace, variable, context) {
			context = context || "general";
			return this.__registry[namespace][context][variable];
		},

		/**
		* This function allows you to get a context object for a blueprint object.
		*   This object is used as the context object for blueprint functions.
		*   All objectIds are set as properties on this object, allowing the
		*   function to reference them as <code>this.objectId</code>.
		*
		* @param blueprintObj {qx.core.Object}
		*   A blueprint object. Used to look up which namespace to check in.
		* @param context {String}
		*   The name of the context to provide. If unspecified, this will
		*     default to "general".
		* @return {Object}
		*   Returns a context object with properties assigned to each objectId.
		*/
		getContext: function(blueprintObj, context) {
			if (qx.lang.Type.isFunction(blueprintObj.getBlueprintNamespace)) {
				return this.getContextByNamespace(blueprintObj.getBlueprintNamespace(), (context || "general"));
			} else {
				this.warn("Registry error: " + blueprintObj + " is not a blueprint object. Cannot get " + context);
			}
		},

		/**
		* This function allows you to get a context object for a blueprint object
		*   by specifying the namespace as a string. (This function is called by
		*   {@link blueprint.util.Registry#getContext} and does the same thing,
		*   but with slightly different arguments.)
		*
		* @param namespace {String}
		*   The namespace to create the context object with.
		* @param context {String}
		*   The name of the context to provide. If unspecified, this will
		*     default to "general".
		* @return {Object}
		*   Returns a context object with properties assigned to each objectId.
		*/
		getContextByNamespace: function(namespace, context) {
			context = context || "general";
			var contextObj = {};
			for (var o in this.__registry[namespace][context]) {
				if (!qx.lang.String.startsWith(o, "__")) {
					contextObj[o] = this.__registry[namespace][context][o];
				}
			}
			return contextObj;
		},

		/**
		* This function allows you to set the value of an objectId.
		*
		* @param blueprintObj {qx.core.Object}
		*   A blueprint object. Used to look up which namespace to check in.
		* @param variable {String}
		*   The objectId to set.
		* @param object {var}
		*   The value to set to the objectId.
		* @param context {String}
		*   The context to look up the objectId in. If unspecified, this will
		*     default to "general".
		*/
		set: function(namespace, variable, object, context) {
			context = context || "general";
			// Create a namespace if it is undefined.
			if (this.__registry[namespace] === undefined) {
				this.__registry[namespace] = {};

				// Set the app reserved reference.
				blueprint.util.Misc.setDeepKey(this.__registry[namespace], ["general", "app"], qx.core.Init.getApplication());
			}

			// Create a context if it is undefined.
			if (this.__registry[namespace][context] === undefined) {
				this.__registry[namespace][context] = {};
			}

			qx.core.Assert.assertNotNull(variable.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/), "Invalid Object ID: (" + variable + ") -- ObjectIds must match the regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/");
			qx.core.Assert.assert(this.__reserved[variable] !== true, "Cannot register variable name: \"" + variable + "\"; It is reserved.");

			this.__registry[namespace][context][variable] = object;
		},

		/**
		* This registers a function as an objectId in a namespace.
		*
		* @param namespace {String}
		*   The namespace to create the function object in.
		* @param functionName {String}
		*   The objectId to set the function to.
		* @param functionVar {Function}
		*   The function object to assign to the functionName.
		*/
		registerFunction: function(namespace, functionName, functionVar) {
			blueprint.util.Misc.setDeepKey(this.__registry, [namespace, "functions", functionName], functionVar);
		},

		/**
		* This will return a function object by name from a namespace.
		*
		* @param namespace {String}
		*   The namespace to create the function object in.
		* @param functionName {String}
		*   The objectId to retrieve.
		* @return {Function}
		*   The requested function object.
		*/
		getFunctionByNamespace: function(namespace, functionName) {
			return this.__registry[namespace]["functions"][functionName];
		},

		/**
		* This will clear all data within a namespace.
		*
		* @param namespace {String}
		*   The namespace to clear.
		*/
		clear: function(namespace) {
			if (this.__registry[namespace]) {
				for (var context in this.__registry[namespace]) {
					for (var variable in this.__registry[namespace][context]) {
						delete(this.__registry[namespace][context][variable]);
					}
					delete(this.__registry[namespace][context]);
				}
				delete this.__registry[namespace];
			}
		},

		/**
		* This will discard all registry data and start a new index.
		*/
		clearAll: function(namespace) {
			this.__registry = {};
		}
	}
});
