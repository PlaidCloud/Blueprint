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

// This class is designed to take the place of both a qx.ui.form.Form and a qx.data.controller.Form and manage form data in the blueprint data layer.
qx.Class.define("blueprint.data.Form", {
    extend: qx.ui.form.Form,

    include: [
    blueprint.MBlueprintManager],

    construct: function(vData, namespace, skipRecursion) {
        this.base(arguments);
        this.set(vData.qxSettings);

        // Add form elements here.
        var formElements = blueprint.util.Registry.getInstance().getContextByNamespace(namespace, "form");
        for (var elm in formElements) {
            if (qx.lang.Type.isFunction(formElements[elm].getBlueprintForm) && formElements[elm].getBlueprintForm() == vData.objectId) {
                this.add(formElements[elm], elm);
            }
        }
    },

    properties: {
        controller: {
            check: "blueprint.data.controller.Form"
        }
    }
});
