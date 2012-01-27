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

/**This probably needs a placeholder instead of this extension thing.
 */
qx.Class.define("designer.blueprint.ui.tabview.TabView",
{
    extend  : blueprint.ui.tabview.TabView,
    include : [
        designer.util.MJson, 
        designer.util.MDeafener,
        designer.util.MReadOnly,
        designer.util.MPropertyUtil,
        designer.util.MSelectable
    ],
    
    members : {
    	postDeafening : function() {
    		this.addListener("changeSelection", designer.core.manager.Selection.getInstance().clearSelection);
    	}
    },
    statics: {
        icon: "fugue/icons/ui-tab-content.png"
    }
});
