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

qx.Class.define("designer.selector.Abstract", {
    extend: qx.ui.window.Window,
    
    type: "abstract",
    
    /** @param icon The path to the icon for the window.
     *  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(icon, genID, prop) {
        var caption = prop; //built from property name and object
        this.base(arguments, caption, icon);
        this.setObjectRegister(or);
        this.setPropertyName(prop);
        this.setOldValue(qx.core.Init.getApplication().getManager().getProperty(genID, prop)); //get from manager
        this.setNewValue(this.getOldValue());
        
        this.setSetButton(new qx.ui.form.Button("Set Value"));
        this.getSetButton().addListener("execute", this._setProperty, this);
        //this.getRoot.add(button);
        
        this.setCancelButton(new qx.ui.form.Button("Cancel"));
        this.getCancelButton().addListener("execute", this.close, this);
        //this.getRoot.add()
        
        this.add(this.getCancelButton());
        this.add(this.getSetButton());
    },
    
    properties: {
        /** The generated ID of the object to be edited.
         */
        generatedID: {
            check: "String"
        },
        
        /** The name of the property to be edited.
         */
        propertyName: {
            check: "String"
        },
        
        /** The value of the property when the selector was created.
         */
        oldValue: {
            check: "Object"            
        },
        
        /** The value that the selector will try to set the property to.
         */
        newValue: {
            check: "Object",
            event: "changeValue"
        },
        
        /** A button that sends a setProperty message to the Manager.
         */
        setButton: {
            check: "qx.ui.form.Button"
        },
        
        /** A button that closes the selector without changing anything.
         */
        cancelButton: {
            check: "qx.ui.form.Button"
        }
    },
    
    members: {
        /** called when button pressed, calls setProperty on manager
         * @return 0 on success.
         */
        _setProperty: function() {
            var code = qx.core.Init.getApplication().getManager().setProperty(this.getGeneratedID(), this.getPropertyName(), this.getNewValue());
            if (code == 0) {
                this.close();
            } else {
                //error handling goes here.
            }
            return code;
        }
    }
}); 
