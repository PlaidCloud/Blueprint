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

/** A selector for numeric properties of integer type. Currently does nothing different form float.
 */
qx.Class.define("designer.selector.Int", {
    extend: designer.selector.Abstract,
    
    /** @param icon The path to the icon for the window.
     *  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(icon, genID, prop) {
        this.base(arguments, icon, genID, prop);
        
        this.setIntInput(new qx.ui.form.Spinner(-Infinity, this.getNewValue(), Infinity));
        this.getIntInput().bind("value", this, "newValue");
        this.add(this.getIntInput());
    },
    
    properties: {
        /** An input field for the value that the property will be set to.
         */
        intInput: {
            check: "qx.ui.form.Spinner"
        }
    }
});
