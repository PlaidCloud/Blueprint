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

qx.Class.define("designer.blueprint.ui.control.ColorSelector",
{
    extend  : blueprint.ui.control.ColorSelector,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MReadOnly,
        designer.util.MPropertyUtil,
        designer.util.MSelectable
    ],
    statics: {
        icon: "fugue/icons/color.png"
    }
});
