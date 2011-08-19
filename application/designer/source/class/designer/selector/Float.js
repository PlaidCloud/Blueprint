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

/** A selector for properties of type Num, which are floats. Currently does nothing different from Int.
 */ 
qx.Class.define("designer.selector.Float", {
    extend: designer.selector.Abstract,
    
    /** @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(genID, prop) {
        this.base(arguments, genID, prop);
        
        this.setFloatInput(new qx.ui.form.Spinner(-9007199254740992, this.getNewValue(), 9007199254740992));
        this.getFloatInput().bind("value", this, "newValue");
        this.add(this.getFloatInput());
    },
    
    properties: {
        /** An input field for the value that the property will be set to.
         */
        floatInput: {
            check: "qx.ui.form.Spinner"
        }
    },
    
    members: {
        _reset: function() {
            this.base(arguments);
            
            //this.debug("Adams: selector.String, newValue: " + this.getNewValue());
            this.getFloatInput().setValue(this.getNewValue());
        }
    }
});
