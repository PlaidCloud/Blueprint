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

//DOESNT WORK IN TEST, but might work in actual designer. Error relating
//to lack of registry.
qx.Class.define("designer.blueprint.ui.form.RadioButton",
{
    extend  : blueprint.ui.form.RadioButton,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MMovable,
        designer.util.MResizable,
        designer.util.MReadOnly
    ]
});
