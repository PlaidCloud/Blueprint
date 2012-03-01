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

/** An abstract for a selector, a window that allows one to select the
 *  value for a property.
 */
qx.Class.define("designer.selector.window.Abstract", {
    extend: designer.ui.window.Window,
    
    type: "abstract",
    
    /** @param icon The path to the icon for the window.
     *  @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(icon, genID, prop) {
        var caption = prop; //built from property name and object
        this.base(arguments, caption, icon);
        this.setGeneratedId(genID);
        this.setPropertyName(prop);
        this.setOldValue(qx.core.Init.getApplication().getManager().getProperty(genID, prop)); //get from manager
        this.setNewValue(this.getOldValue());
        
        this.setSetButton(new qx.ui.form.Button("Set Value"));
        this.getSetButton().addListener("execute", this._setProperty, this);
        
        this.setCancelButton(new qx.ui.form.Button("Cancel"));
        this.getCancelButton().addListener("execute", this.close, this);
        
        this.setLayout(new qx.ui.layout.Grid())
        this.add(this.getCancelButton(), {row: 1, column: 0});
        this.add(this.getSetButton(), {row: 1, column: 1});
    },
    
    properties: {
        /** The generated ID of the object to be edited.
         */
        generatedId: {
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
            nullable: true          
        },
        
        /** The value that the selector will try to set the property to.
         */
        newValue: {
            nullable: true
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
            var code = qx.core.Init.getApplication().getManager().setProperty(this.getGeneratedId(), this.getPropertyName(), this.getNewValue());
            if (code == 0) {
                this.close();
            } else {
                //error handling goes here.
            }
            return code;
        }
    }
}); 
