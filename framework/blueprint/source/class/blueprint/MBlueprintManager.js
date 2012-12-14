/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2012 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

/**
* Provides blueprintManager functionality to any widget.
* This mixin will add the core blueprint functions for building and linking
* within a blueprint object.
*/
qx.Mixin.define("blueprint.MBlueprintManager", {
	/**
	* Continues the creation of a blueprint object; this runs after the standard
	* blueprint constructor. This will set the constructorSettings, blueprint
	* namespace, and objectId to this object. Blueprint components will be
	* generated using blueprint.Manager assigned to a qooxdoo property matching
	* the property name on the vData passed in. If this object has an add
	* function and the vData has a children array, each object in that array will
	* be generated and passed into the add function with its accompanying
	* layoutmap. If this object has a postMixinConstruct function, it is run at
	* the end of this constructor. If this object has a __postContainerConstruct__
	* function, it is registered here and run from
	* {@link blueprint.TopContainer#construct}.
	*
	* @param vData {Object}
	*	The JSON describing this object.
	* @param namespace {String}
	*	The string name used to globally identify all objectIDs within this object.
	* @param skipRecursion {Boolean}
	*	If true, none of this object's children be created.
	*/
	construct: function(vData, namespace, skipRecursion) {
		if (qx.lang.Type.isObject(vData.constructorSettings)) {
			this.setConstructorSettings(vData.constructorSettings);
		} else {
			this.setConstructorSettings({});
		}

		this.setBlueprintNamespace(namespace);

		// Register this object in the namespace if it has a variable name.
		if (vData && qx.lang.Type.isString(vData.objectId) && vData.objectId !== '') {
			if (!skipRecursion && blueprint.util.Registry.getInstance().get(this, vData.objectId)) {
				this.warn("Warning: " + vData.objectId + " is defined more than once in this definition.");
			}

			this.setObjectId(vData.objectId);
			blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this);
		}

		// Generate any components for the object.
		if (qx.lang.Type.isObject(vData.components)) {
			var clazz = qx.Class.getByName(vData.objectClass);
			qx.core.Assert.assertNotUndefined(clazz);

			for (var c in vData.components) {
				qx.core.Assert.assert(qx.Class.hasProperty(clazz, c), "Component property " + c + " not found for " + vData.objectClass);
				// Hack in case there is an object wrapper around the component
				if (qx.lang.Type.isObject(vData.components[c].object)) {
					var temp = vData.components[c].object;
					delete(vData.components[c].object);
					vData.components[c] = temp;
				}
				// If the component is located in the data nodes, fetch and apply it to this object.
				if (qx.lang.Type.isString(vData.components[c])) {
					blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__').push(blueprint.util.Misc.buildComponent(this, vData.components[c], c, namespace));
					blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__').push([]);
				}

				// If the component is listed inside this object, create it and apply it to this object.
				if (qx.lang.Type.isObject(vData.components[c])) {
					var newComp = blueprint.Manager.getInstance().buildObject(vData.components[c], namespace);
					this.set(c, newComp);
				}
			}
		}

		// If this object is a container, generate the contents.
		if (vData) {
			if (!skipRecursion && qx.lang.Type.isArray(vData.contents) && vData.contents.length > 0 && qx.lang.Type.isFunction(this.add)) {
				for (var i = 0; i < vData.contents.length; i++) {
					this.add(blueprint.Manager.getInstance().generate(vData.contents[i].object, this, namespace), vData.contents[i].layoutmap);
				}
			}
		}

		// Check for and run any post-mixin constructors.
		if (qx.lang.Type.isFunction(this.postMixinConstruct)) {
			this.postMixinConstruct(vData, namespace, skipRecursion);
		}

		// Store any functions that need to be run for an object after the entire object is created.
		if (qx.lang.Type.isFunction(this.postContainerConstruct)) {
			blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__').push(this.postContainerConstruct);
			blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__').push([vData, namespace, skipRecursion, this]);
		}
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties: {
		/**
		* The namespace for this object. All objectIds for this object can be
		* looked up via this value.
		*/
		blueprintNamespace: {
			check: "String",
			init: null,
			nullable: true
		},

		/**
		* This is a general purpose arguments object. Should probably be deprecated
		* all functionality implemented here moved into qxSetting properties with
		* transform/apply methods. Problems in constructorSettings often fail
		* silently and documentation is poor.
		*/
		constructorSettings: {
			check: "Object"
		},

		/**
		* The objectId for this object. Within a namespace, this identifier should
		* be unique to this object.
		*/
		objectId: {
			check: "String",
			init: ""
		}
	}
});
