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

qx.Class.define("designer.ui.menu.MenuDelegate", 
{
	extend: qx.core.Object,
	members: {
		bindItem: function(controller, item, id) {
			controller.bindDefaultProperties(item, id);
			controller.bindProperty("genId", "genId", null, item, id);
		},
		createItem: function() {
			return new designer.ui.menu.MenuItem();
		}
	}
});
