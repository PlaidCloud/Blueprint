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

qx.Class.define("designer.selector.Color", {
    extend: designer.selector.Abstract,
    
    construct: function(genID, prop) {
        this.base(arguments, genID, prop);
        
        this.setColorSelector(new qx.ui.control.ColorSelector());
        
        this.getColorSelector().setValue(this.getOldValue());
        this.getColorSelector().bind("value", this, "newValue", null)
        this.add(this.getColorSelector());
    },
    
    properties: {
        colorSelector: {
            check: "qx.ui.control.ColorSelector"
        }
    }
});
