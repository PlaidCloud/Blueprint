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

qx.Class.define("blueprint.ui.form.RadioButton", {
    extend: qx.ui.form.RadioButton,

    include: [
    blueprint.MBlueprintManager, blueprint.ui.form.MSubmitElement],

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct: function(vData, namespace, skipRecursion) {
        this.base(arguments);

        this.set(vData.qxSettings);
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {
        blueprintRadioGroup: {
            check: "String",
            init: null
        }
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members: {
        // Register this radio button with a radioGroup
        postContainerConstruct: function(vData, namespace, skipRecursion, self) {
            if (self.getBlueprintNamespace() != null && self.getBlueprintRadioGroup() != null) {
                var radioGroup = blueprint.util.Registry.getInstance().get(self, self.getBlueprintRadioGroup());
                radioGroup.add(self);
            }
        }
    }
});
