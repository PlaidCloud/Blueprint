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

qx.Class.define("designer.blueprint.ui.basic.Label",
{
    extend  : blueprint.ui.basic.Label,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MReadOnly,
        designer.util.MPropertyUtil,
        designer.util.MSelectable
    ],
    statics: {
    	stub : '{\n\t"objectClass": "blueprint.ui.basic.Label",\n\t"qxSettings": {\n\t\t"value": "New Label"\n\t}\n}',
        icon: "fugue/icons/ui-label.png"
    }
});
