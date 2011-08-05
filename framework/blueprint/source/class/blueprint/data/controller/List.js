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

qx.Class.define("blueprint.data.controller.List", {
    extend: qx.data.controller.List,

    include: [
    blueprint.MBlueprintManager],

    construct: function(vData, namespace, skipRecursion) {
        var model = null;
        var target = null;

        if (vData.constructorSettings) {
            if (vData.constructorSettings.target) {
                target = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.target);
            }
        }

        this.base(arguments, model, target, vData.constructorSettings.labelPath);

        this.set(vData.qxSettings);
    },

    properties: {
        converter: {
            init: false,
            check: "Boolean"
        }
    },

    members: {
        // Default conversion functions.
        model2target: function(model) {
            return {
                converter: function(data) {
                    for (var i = 0; i < model.getLength(); i++) {
                        var item = model.getItem(i);
                        if (item.getValue() == data) {
                            return item;
                        }
                    }
                    return model.getItem(0);
                }
            };
        },

        target2model: function() {
            return {
                converter: function(data) {
                    if (data) {
                        return data.getValue();
                    }
                }
            };
        },

        registerModel: function(model) {
            var target = this.getTarget();

            if (model) {
                if (qx.lang.Type.isFunction(model.setController)) {
                    model.setController(this);
                }

                if (target && qx.lang.Type.isFunction(target.setController)) {
                    target.setController(this);
                }

                if (model.USE_VALUE_AS_MODEL) {
                    model = model.getValue();
                }
            }

            if (model) {
                this.setModel(model);
            }

            if (model && target && this.getConverter()) {
                var formController = blueprint.util.Registry.getInstance().get(this, target.getBlueprintForm()).getController();

                formController.addBindingOptions(target.getObjectId(), this.model2target(model), this.target2model());
            }
        },

        // Register default conversion functions if necessary.
        postContainerConstruct: function(vData, namespace, skipRecursion, self) {
            var reg = blueprint.util.Registry.getInstance();
            self.registerModel(reg.getByNamespace(namespace, vData.constructorSettings.model));
        }
    }
});
