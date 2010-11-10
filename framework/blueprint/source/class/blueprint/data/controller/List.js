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
        var labelPath = null;

        if (vData.constructorSettings != undefined)
        {
            if (vData.constructorSettings.model != undefined) {
                model = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model);
                if (qx.lang.Type.isFunction(model.getValue)) {
                    model = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model).getValue();
                }
            }
            if (vData.constructorSettings.target != undefined) {
                target = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.target);
            }
            if (vData.constructorSettings.labelPath != undefined) {
                labelPath = vData.constructorSettings.labelPath;
                //labelPath = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model).getValue();
            }
        }

        this.base(arguments, model, target, labelPath);

        this.set(vData.qxSettings);
    },

    properties :
    {

    }
});