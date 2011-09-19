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
            //this.debug("Adams, inside MenuButton's editContents");
            var childrenIds = qx.core.Init.getApplication().getManager().getObjectContents(this.getGeneratedId());
            //this.debug("Adams, MenuButton, childrenIds: " + childrenIds);
            if (!this._editWindow) {
                this._editWindow = new qx.ui.window.Window(this.getRepClassName() + "(" + this.getGeneratedId() + ")");
                this._editWindow.setLayout(new qx.ui.layout.VBox());
                if (this._contents.length === 0) {
                	this._editWindow.add(new qx.ui.basic.Label("No Contents."))
                } else {
		            for (var i=0; i<this._contents.length; i++) {
		                //this.debug("Adams, MenuButton, adding " + this._contents[i]);
		                this._editWindow.add(this._contents[i]);
		            }
		        }
            }
            this._editWindow.show();
        }
    }
});
