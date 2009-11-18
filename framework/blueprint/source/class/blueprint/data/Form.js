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

// This class is designed to take the place of both a qx.ui.form.Form and a qx.data.controller.Form and manage form data in the blueprint data layer.
qx.Class.define("blueprint.data.Form",
{
    extend : qx.core.Object,

    include :
    [
    blueprint.MBlueprintManager
    ],

    construct : function(vData, namespace, skipRecursion)
    {
        this.base(arguments);
        this.set(vData.qxSettings);
        
        var form = new qx.ui.form.Form();
        
        // Add form elements here.
        var formElements = blueprint.util.Registry.getInstance().getContextByNamespace(namespace, "form");
        for (var elm in formElements) {
            if (formElements[elm].getBlueprintForm() == vData.objectId) {
                form.add(formElements[elm], elm);
            }
        }
        
        if (vData.constructorSettings.resetButton != undefined) {
            var button = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.resetButton);
            button.addListener("execute", function(e) {
                this.getForm().reset();
            }, this);
        }
        
        var controller = new qx.data.controller.Form(null, form);
        var model = controller.createModel();
        
        this.setForm(form);
        
        this.setController(controller);
        
        this.setModel(model);
    },

    properties :
    {
        form :
        {
            check: "qx.ui.form.Form"
        },

        controller :
        {
            check: "qx.data.controller.Form"
        },
        
        model :
        {
            check: "Object"
        }
    },
    
    members :
    {
        
    }
});