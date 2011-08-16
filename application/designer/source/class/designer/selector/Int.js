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

qx.Class.define("designer.selector.Int", {
    extend: designer.selector.Abstract,
    
    /** @param icon The path to the icon for the window.
     *  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(icon, genID, prop) {
        this.base(arguments, icon, genID, prop);
        
        this.setIntInput(new qx.ui.form.TextAea(this.getNewValue.toString()));
        this.getIntInput().bind("value", this, "newValue", {
            converter: function(val, model, sourceObj, target) {
                try {
                    return parseInt(val);
                } catch(err) {
                    //handle error here
                    throw(err);
                }
            }
        });
        this.add(this.getIntInput);
    },
    
    properties: {
        /** An input field for the value that the property will be set to.
         */
        intInput: {
            check: "qx.ui.form.TextArea"
        }
    }
});
