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
* Provides form element submission to objects.
*/
qx.Mixin.define("blueprint.ui.form.MSubmitElement", {
    construct: function(vData, namespace, skipRecursion) {
        if (vData.objectId != "") {
            blueprint.util.Registry.getInstance().set(namespace, vData.objectId, this, "form");
        } else {
            this.warn("Form elements without object Ids cannot be referenced.");
        }
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {
        blueprintForm: {
            init: null,
            check: "String",
            nullable: true
        }
    }
});
