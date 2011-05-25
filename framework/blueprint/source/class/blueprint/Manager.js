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

qx.Class.define("blueprint.Manager", {
    extend: qx.core.Object,
    type: "singleton",

    construct: function() {
        this.base(arguments);

        // A monotonic counter for creating objects.
        this.__objectCounter = 0;
    },

    members: {
        __objectCounter: null,

        generate: function(vData, parent, namespace, skipRecursion) {
            // Anything that isn't a top_container needs to have a parent.
            if (vData.type != 'top_container' && vData.type != 'application_container' && parent == undefined) {
                throw new Error("Generating new objects must have a parent unless they are top_containers. (" + vData.type + "//" + parent + ")");
            }

            // Set the namespace for a top_container.
            if (vData.type == 'top_container' && namespace == undefined) {
                namespace = 'top_container.' + this.__objectCounter++;
            }

            if (vData.data == undefined) {
                vData.data = new Array();
            }
            if (vData.qxSettings == undefined) {
                vData.qxSettings = new Object();
            }
            if (vData.constructorSettings == undefined) {
                vData.constructorSettings = new Object();
            }

            //this.debug('GENERATING==> ' + vData.objectClass);
            var newItem = this.buildObject(vData, namespace, skipRecursion);

            return newItem;
        },

        buildObject: function(vData, namespace, skipRecursion) {
            var clazz = qx.Class.getByName(vData.objectClass);
            if (clazz != undefined) {
                var newItem = new clazz(vData, namespace, skipRecursion);

                return newItem;
            } else {
                throw new Error("Clazz not found for '" + vData.objectClass + "'. All blueprint classes were not included. Try clearing your cache and run the generate source job?");
            }
        }
    }
});
