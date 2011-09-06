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

qx.Class.define("designer.blueprint.ui.toolbar.MenuButton",
{
    extend: designer.placeholder.EditableBranch,
    members: {
        editContents: function() {
            this.debug("Adams, inside MenuButton's editContents");
            var childrenIds = qx.core.Init.getApplication().getManager().getObjectContents(this.getGeneratedId());
            this.debug("Adams, MenuButton, childrenIds: " + childrenIds);
        }
    }
});
