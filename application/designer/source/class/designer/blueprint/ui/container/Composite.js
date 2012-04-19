/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* 
*/

qx.Class.define("designer.blueprint.ui.container.Composite",
{
    extend  : blueprint.ui.container.Composite,
    include : [
        designer.util.MJson,
        designer.util.MPropertyUtil
    ],
    statics: {
	    stub : '{"objectClass": "blueprint.ui.container.Composite","qxSettings": {"height": 100, "width": 100}, "constructorSettings": {"innerLayout": "qx.ui.layout.Canvas"}}',
        icon: "fugue/icons/selection.png"
    }
});
