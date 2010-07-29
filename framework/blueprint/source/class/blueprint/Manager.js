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
    extend : qx.core.Object,
    type : "singleton",

    construct : function()
    {
        this.base(arguments);
        this.__application = qx.core.Init.getApplication();

        // A monotonic counter for creating objects.
        this.__objectCounter = 0;
    },

    properties :
    {
        // Set this property if you want to override the default blueprint manager.
        alternateManager :
        {
            check : "Object",
            init : null,
            nullable : true
        }
    },

    members :
    {
        __objectCounter : null,

        generate : function(vData, parent, namespace, skipRecursion) {
            if (this.getAlternateManager() != null) {
                return this.getAlternateManager().generate(vData, parent, namespace, skipRecursion);
            } else {
                // Anything that isn't a top_container needs to have a parent.
                if (vData.type != 'top_container' && vData.type != 'application_container' && parent == undefined) {
                    throw new Error("Generating new objects must have a parent unless they are top_containers. (" + vData.type + "//" + parent +")");
                }

                // Set the namespace for a top_container.
                if (vData.type == 'top_container' && namespace == undefined) {
                    namespace = 'top_container.' + this.__objectCounter++;
                }

                if (vData.data == undefined) { vData.data = new Array(); }
                if (vData.qxSettings == undefined) { vData.qxSettings = new Object(); }
                if (vData.constructorSettings == undefined) { vData.constructorSettings = new Object(); }

                //this.debug('GENERATING==> ' + vData.objectClass);

                var newItem = this.__buildObject(vData, namespace, skipRecursion);

                if (vData.type == 'top_container') {
                    // Add a pointer in the registry so any blueprint element in a namespace can find the top_container.
                    blueprint.util.Registry.getInstance().set(namespace, "top_container", newItem, "top_container");
                    
                    // If the object is a top container, check for namespace fucntions that need to be run after object creation.
                    
                    if (blueprint.util.Registry.getInstance().check(newItem, '__postContainerConstruct__') && 
                    blueprint.util.Registry.getInstance().check(newItem, '__postContainerConstruct__args__')) {
                        var constructors = blueprint.util.Registry.getInstance().get(newItem, '__postContainerConstruct__');
                        var args = blueprint.util.Registry.getInstance().get(newItem, '__postContainerConstruct__args__');
                        for (var k=0;k<constructors.length;k++) {
                            constructors[k](args[k][0], args[k][1], args[k][2], args[k][3]);
                        }

                        blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__', null);
                        blueprint.util.Registry.getInstance().set(namespace, '__postContainerConstruct__args__', null);
                    }
                }
                return newItem;
            }
        },

        __buildObject : function(vData, namespace, skipRecursion)
        {
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
