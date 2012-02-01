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

/* **********************************************

#ignore(jsonlint)
#ignore(JSV)

********************************************** */

/** TODO doc
*/
qx.Class.define("designer.ui.tabview.page.Abstract", {
	extend: qx.ui.tabview.Page,
	type: "abstract",
	
	construct: function(label, icon) {
		this.setTabButtons([]);
		
		this.base(arguments, label, icon);
	},
	
	properties: {
		tabButtons : {
			check: "Array"
		}
	},
	
	members: {
	}
});
