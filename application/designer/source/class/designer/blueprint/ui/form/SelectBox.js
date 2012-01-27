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

//Currently horizontal bar appears under this when clicked. Probably 
//needs extensive rewrite, like not even subclassing selectbox, or 
//completely rewriting the drawing code to fix. 
qx.Class.define("designer.blueprint.ui.form.SelectBox",
{
    extend  : blueprint.ui.form.SelectBox,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MReadOnly,
        designer.util.MPropertyUtil,
        designer.util.MSelectable
    ],
    statics: {
        icon: "fugue/icons/ui-combo-box.png"
    }
});
