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

/** A selector window for string properties.
 */
qx.Class.define("designer.selector.String", {
    extend: designer.selector.Abstract,
    
    /** @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(genID, prop) {
        this.base(arguments, genID, prop);
        
        this.setStringInput(new qx.ui.form.TextArea(this.getNewValue()));
        this.getStringInput().bind("value", this, "newValue");
        this.add(this.getStringInput());
    },
    
    properties: {
        /** An input field for the value that the property will be set to.
         */
        stringInput: {
            check: "qx.ui.form.TextArea"           
        }
    }
});