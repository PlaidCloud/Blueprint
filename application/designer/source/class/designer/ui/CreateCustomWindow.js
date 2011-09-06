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


/** TODOC
 */
qx.Class.define("designer.ui.CreateCustomWindow", {
    extend: qx.ui.window.Window,

    /** TODOC
     */
    construct: function() {
        this.base(arguments, "Create Object with Custom Stub.");
        var grid = new qx.ui.layout.Grid();
        grid.setColumnWidth(0, 150);
        grid.setColumnWidth(1, 150);
        this.setLayout(grid);
        
        this._stubArea = new qx.ui.form.TextArea();
        this.add(this._stubArea, {row:0, column: 0, colSpan: 2});
        
        this._cancelButton = new qx.ui.form.Button("Cancel");
        this._cancelButton.addListener("click", this.close, this)
        this.add(this._cancelButton, {row: 1, column: 0});
        
        this._createButton = new qx.ui.form.Button("Create");
        this.add(this._createButton, {row: 1, column: 1});
        
    },

    properties: {
        selection: {
            check: "String"
        },
        classname: {
            check: "String",
            apply: "_applyClassname"
        }
    },

    members: {
        _applyClassname: function(newvalue, oldvalue) {
            //TODO: get stub by class somehow
            //this._stubArea.label = /*get stub by class somehow*/
            this.debug("Adams, CreateCustomWindow, in _applyClassname");
            this.debug("Adams, oldvalue: " + oldvalue);
            this.debug("Adams, newvalue: " + newvalue);
            this._stubArea.setValue(newvalue + "'s stub goes here");
            return(newvalue);
        },
        create: function(e) {
            this.debug("Adams, Well, I would be adding a " + this.getClassname() + " to " + this.getSelection() + ", with a special stub even: " + this._stubArea.getValue());
        }  
    },

    destruct: function() {
    }
});
