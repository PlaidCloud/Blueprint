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
        if (vData.constructorSettings != undefined) {
            this.setConstructorSettings(vData.constructorSettings);
        } else {
            this.setConstructorSettings(new Object());
        }

        if (namespace != undefined) {
            this.setBlueprintNamespace(namespace);
        }

        // Register this object in the namespace if it has a variable name.
        if (vData != undefined && vData.objectId != undefined && vData.objectId != '') {
            var validIds = vData.objectId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (validIds != null && validIds.length == 1 && validIds[0] == vData.objectId) {
                this.setObjectId(vData.objectId);
                blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this);
            } else {
                throw new Error("Invalid Object ID: (" + vData.objectId + ") -- ObjectIds must match the regex: [a-zA-Z_][a-zA-Z0-9_]*");
            }
        }

        // Set the object type and if this object is a container, generate the contents.
        if (vData != undefined) {
            if (!skipRecursion && vData.contents != undefined && vData.contents.length > 0 && qx.lang.Type.isFunction(this.add)) {
                for (var i = 0; i < vData.contents.length; i++) {
                    this.add(blueprint.Manager.getInstance().generate(vData.contents[i].object, this, namespace), vData.contents[i].layoutmap);
                }
            }
        }

        // Check for and run any post-mixin constructors.
        if (qx.lang.Type.isFunction(this.postMixinConstruct)) {
            this.postMixinConstruct(vData, namespace, skipRecursion);
        }

        // Store any functions that need to be run for an object after the entire form is created.
        if (qx.lang.Type.isFunction(this.postContainerConstruct)) {
            if (blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__') == false && blueprint.util.Registry.getInstance().check(this, '__postContainerConstruct__args__') == false) {
                blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', new Array());
                blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', new Array());
            }
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
