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


/** TODOC
 */
qx.Class.define("designer.ui.form.ObjectItem", {
    extend: qx.ui.container.Composite,

    /** TODOC
     */
    construct: function(genId) {
        this.base(arguments, new qx.ui.layout.HBox());
        
        this.add(new qx.ui.basic.Label(genId));
        
        this.setGeneratedId(genId);
    },

    properties: {
        generatedId: {
            check: String,
            nullable: true
        }
    },

    members: {
    },

    destruct: function() {
    }
});
