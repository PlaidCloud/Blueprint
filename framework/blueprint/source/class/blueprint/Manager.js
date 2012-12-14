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
* This object is responsible for generating new blueprint objects from JSON.
*/
qx.Class.define("blueprint.Manager", {
    extend: qx.core.Object,
    type: "singleton",

    /**
    * The constructor initializes the object counter. The object counter is
    * used when no namespace is provided and a unique name is needed.
    */
    construct: function() {
        this.base(arguments);

        // A monotonic counter for creating objects.
        this.__objectCounter = 0;
    },

    members: {
        __objectCounter: null,

        /**
        * Generate is called each time a blueprint object needs to be
        * constructed. It sanitizes vData and calls the appropriate
        * constructor function for the object.
        * @param vData {Object}
        *   The JSON describing this object.
        * @param parent {Object}
        *   The parent of this object. Usually this means layout parent, but
        *   sometimes this can be the component parent. Strictly speaking,
        *   it is the enclosing json object. (This argument can be null when
        *   generating the {@link blueprint.TopContainer}.)
        * @param namespace {String}
        *   The string name used to globally identify all objectIDs within this object.
        * @param skipRecursion {Boolean}
        *   If true, none of this object's children be created.
        * @return {Object} The generated object.
        */
        generate: function(vData, parent, namespace, skipRecursion) {
            // Anything that isn't a top_container needs to have a parent.
            if (vData.objectClass != "blueprint.TopContainer" && parent === undefined) {
                throw new Error("Generating new objects must have a parent unless they are top_containers. (" + vData.type + "//" + parent + ")");
            }

            // Set the namespace for a top_container.
            if (vData.objectClass == "blueprint.TopContainer" && namespace === undefined) {
                namespace = 'top_container.' + this.__objectCounter++;
            }

            if (vData.data === undefined) {
                vData.data = [];
            }
            if (vData.qxSettings === undefined) {
                vData.qxSettings = {};
            }
            if (vData.constructorSettings === undefined) {
                vData.constructorSettings = {};
            }

            var newItem = this.buildObject(vData, namespace, skipRecursion);

            return newItem;
        },

        /**
        * Builds the requested object from the vData.
        * @param vData {String}
        *   The JSON describing this object.
        * @param namespace {String}
        *   The string name used to globally identify all objectIDs within this object.
        * @param skipRecursion {Boolean}
        *   If true, none of this object's children be created.
        * @return {Object} The built object.
        */
        buildObject: function(vData, namespace, skipRecursion) {
            var clazz = qx.Class.getByName(vData.objectClass);
            if (clazz) {
                var newItem = new clazz(vData, namespace, skipRecursion);

                return newItem;
            } else {
                throw new Error("Clazz not found for '" + vData.objectClass + "'. All blueprint classes were not included. Try clearing your cache and run the generate source job?");
            }
        }
    }
});
