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

qx.Class.define("designer.selector.Boolean", {
    extend designer.selector.Abstract,
    
    /** @param icon The path to the icon for the window.
     *  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(icon, genID, prop) {
        this.base(arguments, icon, genID, prop);
        
        this.setBoolGroup(new qx.ui.form.RadioGroup());
        
        this.setTrueButton(new qx.ui.form.RadioButton("true"));
        this.setFalseButton(new qx.ui.form.RadioButton("false"));
        
        this.getBoolGroup().add(this.getTrueButton(), this.getFalseButton());

        if(this.getOldValue()) {
            this.getBoolGroup.setSelection([this.getTrueButton]);
        } else {
            this.getBoolGroup.setSelection([this.getFalseButton]);
        }

        this.getBoolGroup().bind("selection", this, "newValue", {
            converter: function(val, model, sourceObj, target) {
                if (val[0].getValue() == "true") {
                    return true;
                } else {
                    return false;
                }
            }
        })
        this.add(this.getBoolGroup());        
    },
    
    properties: {
        /** A radio group for true and false radio buttons.
         */
        boolGroup {
            check: "qx.ui.form.RadioGroup"
        },
        
        /** A radio button for true.
         */
        trueButton {
            check: "qx.ui.form.RadioButton"
        },
        
        /** A radio button for false.
         */
        falseButton {
            check: "qx.ui.form.RadioButton"
        }
         
    }
});
