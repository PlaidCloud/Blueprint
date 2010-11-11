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

qx.Class.define("blueprint.data.controller.List",
{
    extend : qx.data.controller.List,

    include :
    [
    blueprint.MBlueprintManager
    ],

    construct : function(vData, namespace, skipRecursion)
    {
        var model = null;
        var target = null;

        if (vData.constructorSettings != undefined)
        {
            if (vData.constructorSettings.model != undefined) {
                model = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model);
                
                if (qx.lang.Type.isFunction(model.getValue)) {
                    model = model.getValue();
                }
            }
            if (vData.constructorSettings.target != undefined) {
                target = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.target);
            }
        }

        this.base(arguments, model, target, vData.constructorSettings.labelPath);

        this.set(vData.qxSettings);
    },

    properties :
    {
        converter : {
            init : false,
            check : "Boolean"
        }
    },

    members :
    {
        // Default conversion functions.
        model2target : function(model)
        {
            return {
                converter : function(data) {
                    for (var i = 0; i < model.getValue().getLength(); i++) {
                        var item = model.getValue().getItem(i);
                        if (item.getValue() == data) {
                            return item;
                        }
                    }
                    return model.getValue().getItem(0);
                }
            };
        },
        
        target2model : function()
        {
            return {
                converter: function(data) {
                    return data.getValue();
                }
            };
        },
        
        // Register default conversion functions if necessary.
        postContainerConstruct : function(vData, namespace, skipRecursion, self)
        {
            var model = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model);
            
            if (self.getConverter()) {
                var formController = blueprint.util.Registry.getInstance().getByNamespace(namespace, self.getTarget().getBlueprintForm()).getController();
                
                formController.addBindingOptions(self.getTarget().getObjectId(), self.model2target(model), self.target2model());
            }
        }
    }
});