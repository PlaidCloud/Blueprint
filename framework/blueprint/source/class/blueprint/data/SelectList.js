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


qx.Class.define("blueprint.data.SelectList", {
    extend: qx.core.Object,

    include: [
    blueprint.MBlueprintManager],

    construct: function(vData, namespace, skipRecursion) {
        this.base(arguments);

        this.set(vData.qxSettings);

        var value = vData.constructorSettings.value;

        if (value) {
            value = qx.data.marshal.Json.createModel(value, true);
            this.setValue(value);
        }
    },

    properties: {
        value: {
            init: null,
            event: "changeValue",
            nullable: true
        },

        controller: {
            check: "blueprint.data.controller.List"
        }
    },

    members: {
        USE_VALUE_AS_MODEL: true
    }
});
