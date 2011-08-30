/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Adams Tower
*/


/**
 * A special FormItem for representing objects not assigned to a Form.
 */
qx.Class.define("designer.ui.form.UnassignedFormItem", {
    extend: designer.ui.form.FormItem,

    /**
     * Constructs the UnassignedFormItem
     * @param list The FormList this FormItem is part of.
     */
    construct: function(list) {
        this.base(arguments, null, list);
        
        this.removeAll();
        var label = new qx.ui.basic.Label("Unassigned Objects");
        this.add(label);
        this.setGeneratedId(null);
    },

    properties: {
    },

    members: {
    },

    destruct: function() {
    }
});
