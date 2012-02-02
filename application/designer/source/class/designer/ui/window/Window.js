/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon
*/


/** TODOC
 */
qx.Class.define("designer.ui.window.Window", {
    extend: qx.ui.window.Window,

    /** TODOC
     */
    construct: function(caption, icon) {
        this.base(arguments, caption, icon);
        
        this.setZIndex(20);
    }
});
