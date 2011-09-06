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

qx.Class.define("designer.blueprint.ui.form.Button",
{
    extend  : blueprint.ui.form.Button,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MReadOnly,
        designer.util.MPropertyUtil,
        designer.util.MSelectable
    ],
    statics : {
        STUB : '{\n\t"objectClass": "blueprint.ui.form.Button",\n\t"qxSettings": {\n\t\t"label": "Imabutton"\n\t}\n}'
    }
});
