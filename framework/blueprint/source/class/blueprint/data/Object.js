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

qx.Class.define("blueprint.data.Object", {
    extend: qx.core.Object,

    construct: function(value) {
        this.base(arguments);

        if (value) {
            this.setValue(value);
        }
    },

    properties: {
        value: {
            init: null,
            event: "changeValue",
            nullable: true
        }
    }
});
