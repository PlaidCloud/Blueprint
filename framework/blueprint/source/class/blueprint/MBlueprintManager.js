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
* Provides blueprintManager functionality to any widget.
*/
qx.Mixin.define("blueprint.MBlueprintManager", {
    construct: function(vData, namespace, skipRecursion) {
        if (qx.lang.Type.isObject(vData.constructorSettings)) {
            this.setConstructorSettings(vData.constructorSettings);
        } else {
            this.setConstructorSettings(new Object());
        }

        this.setBlueprintNamespace(namespace);

        // Register this object in the namespace if it has a variable name.
        if (vData && qx.lang.Type.isString(vData.objectId) && vData.objectId != '') {
            var validIds = vData.objectId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (validIds != null && validIds.length == 1 && validIds[0] == vData.objectId) {
                this.setObjectId(vData.objectId);
                blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this);
            } else {
                throw new Error("Invalid Object ID: (" + vData.objectId + ") -- ObjectIds must match the regex: [a-zA-Z_][a-zA-Z0-9_]*");
            }
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
                    blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__').push(new Array());
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
            blueprint.util.Registry.getInstance().get(this, '__postContainerConstruct__args__').push(new Array(vData, namespace, skipRecursion, this));
        }
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {
        blueprintNamespace: {
            check: "String",
            init: null,
            nullable: true
        },

        constructorSettings: {
            check: "Object"
        },

        objectId: {
            check: "String",
            init: ""
        }
    }
});
