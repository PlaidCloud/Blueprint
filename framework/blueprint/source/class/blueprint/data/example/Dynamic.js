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

qx.Class.define("blueprint.data.example.Dynamic", {
    extend: blueprint.data.Object,

    construct: function() {
        this.base(arguments);

        var timer = new qx.event.Timer(5000);

        var x = 0;

        timer.addListener("interval",
        function(e) {
            x++;
            this.setValue(x);
        },
        this);

        timer.start();
    }
});
