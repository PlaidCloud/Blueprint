/* ***********************************************
 *
 * Tartan Blueprint
 *
 * Copyright 2011 Tartan Solutions, Inc
 *
 * License:
 * LGPL: http://www.gnu.org/licenses/lgpl.html
 * EPL: http://www.eclipse.org/org/documents/epl-v10.php
 * See the LICENSE file in the project's top-level directory for details.
 *
 * Authors:
 * * Adams Tower
 * */

qx.Class.define("designer.ui.menu.MenuItem",
{
	extend: qx.ui.tree.VirtualTreeItem,
	properties: {
		genId: {
			check: "String"
		},
		name: {
			check: "String"
		}
	},
	construct: function() {
		this.base(arguments);
		
		if (/*this.getName() != ""*/true) {
			this.setDraggable(true);
		}
		this.setDroppable(true);

		this.addListener("dragstart", function(e) {
			e.addAction("move");

			e.addType("designer/menuobject");
		});
		this.addListener("drop", function(e) {
			if (this.getGenId() == e.getData("designer/menuobject").getGenId()) {
				return;
			} else if (this.getName() == "") {
				qx.core.Init.getApplication().getManager().insertObjectAfter(e.getData("designer/menuobject").getGenId(), this.getGenId());
			} else {
				qx.core.Init.getApplication().getManager().insertObjectBefore(e.getData("designer/menuobject").getGenId(), this.getGenId());
			}
			this.debug("Dropping " + e.getData("designer/menuobject").getGenId() + " on " + this.getGenId());
		});
		this.addListener("droprequest", function(e) {
			var type = e.getCurrentType();

			if (type == "designer/menuobject") {
				e.addData(type, this);
			}
		});
	}
});
