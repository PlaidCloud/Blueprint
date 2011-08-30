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

/** An abstract for a selector, a non-window that allows one to select the
 *  value for a property.
 */
qx.Class.define("designer.selector.Abstract", {
    extend: qx.ui.container.Composite,
    
    type: "abstract",
    
    /** @param genID The generated ID of the object to be edited.
     *  @param prop The name of the property to be edited.
     */
    construct: function(genID, prop, propItem) {
        this.base(arguments);
        if (propItem) {
            this.setPropertyItem(propItem);
        }
        this.setGeneratedID(genID);
        this.setPropertyName(prop);
        this.setOldValue(qx.core.Init.getApplication().getManager().getProperty(genID, prop)); //get from manager
        this.debug(this.getOldValue());
        this.setNewValue(this.getOldValue());
        
        this.setSetButton(new qx.ui.form.Button("Set Value"));
        this.getSetButton().addListener("execute", this._setProperty, this);
        
        this.setResetButton(new qx.ui.form.Button("Reset"));
        this.getResetButton().addListener("execute", this._reset, this);
        
        var box = new qx.ui.layout.HBox();
        box.setReversed(true);
        this.setLayout(box)
        this.add(this.getSetButton());
        this.add(this.getResetButton());
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
        
        /**
         * The PropertyItem that contains this selector.
         */
        propertyItem: {
            nullable: true,
            init: null
        },
        
        /** A button that sends a setProperty message to the Manager.
         */
        setButton: {
            check: "qx.ui.form.Button"
        },
        
        /** A button that resets the selector to the value the property
         *  had when the selector was created.
         */
        resetButton: {
            check: "qx.ui.form.Button"
        }
    },
    
    members: {
        _oldvalue: null,
        _newvalue: null,
        
        setOldValue: function(v) {
            this._oldvalue = v;
        },
        
        getOldValue: function() {
            return this._oldvalue;
        },
        
        setNewValue: function(v) {
            this._newvalue = v;
        },
        
        getNewValue: function(v) {
            return this._newvalue;
        },
        
        /** called when button pressed, calls setProperty on manager
         */
        _setProperty: function() {
            qx.core.Init.getApplication().getManager().setProperty(this.getGeneratedID(), this.getPropertyName(), this.getNewValue());
            if (this.getPropertyItem()) {
                this.getPropertyItem().jsonChanged();
            }
        },
        
        _reset: function() {
            this.setNewValue(this.getOldValue());
            this._setProperty();
        }
    }
}); 
