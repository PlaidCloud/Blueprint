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

/** A selector for boolean properties
 */
qx.Class.define("designer.selector.Boolean", {
    extend: designer.selector.Abstract,
    
    /**  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(genID, prop) {
        this.base(arguments, genID, prop);
        
        this.setBoolGroup(new qx.ui.form.RadioGroup());
        
        this.setTrueButton(new qx.ui.form.RadioButton("true"));
        this.setFalseButton(new qx.ui.form.RadioButton("false"));
        
        this.getBoolGroup().add(this.getTrueButton(), this.getFalseButton());

        if (this.getOldValue() === true ) {
            this.getBoolGroup().setSelection([this.getTrueButton()]);
        } else if (this.getOldValue() === false ) {
            this.getBoolGroup().setSelection([this.getFalseButton()]);
        }
        
        var that = this;

        this.getBoolGroup().bind("selection", this, "newValue", {
            converter: function(val, model, sourceObj, target) {
                //that.debug("Adams, selector.Boolean, val: " + val);
                //that.debug("Adams, selector.Boolean, val[0]: " + val[0]);
                //that.debug("Adams, selector.Boolean, val[0].getValue(): " + val[0].getValue());
                if (val[0] == that.getTrueButton()) {
                    //that.debug("Adams, selector.Boolean, newValue is true");
                    return true;
                } else {
                    //that.debug("Adams, selector.Boolean, newValue is false");
                    return false;
                }
            }
        })
        
        this.add(this.getFalseButton());
        this.add(this.getTrueButton());        
    },
    
    properties: {
        /** A radio group for true and false radio buttons.
         */
        boolGroup: {
            check: "qx.ui.form.RadioGroup"
        },
        
        /** A radio button for true.
         */
        trueButton: {
            check: "qx.ui.form.RadioButton"
        },
        
        /** A radio button for false.
         */
        falseButton: {
            check: "qx.ui.form.RadioButton"
        }         
    },
    
    members: {
        _reset: function() {
            this.base(arguments);
            
            if (this.getOldValue() === true ) {
                this.getBoolGroup().setSelection([this.getTrueButton()]);
            } else if (this.getOldValue() === false ) {
                this.getBoolGroup().setSelection([this.getFalseButton()]);
            }
        }    
    }
});
