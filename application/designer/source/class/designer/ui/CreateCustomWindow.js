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
    extend: designer.ui.window.Window,

    /** TODOC
     */
    construct: function() {
        this.base(arguments, "Create Object with Custom Stub.");
        var grid = new qx.ui.layout.Grid();
        grid.setColumnWidth(0, 150);
        grid.setColumnWidth(1, 150);
        grid.setRowHeight(0, 300);
        this.setLayout(grid);
        
        //this._stubArea = new qx.ui.form.TextArea();
        this._stubArea = new designer.ui.editor.Editor();
        this._stubArea.init("Stub");
        this.add(this._stubArea, {row:0, column: 0, colSpan: 2});
        
        this._cancelButton = new qx.ui.form.Button("Cancel");
        this._cancelButton.addListener("click", this.close, this);
        this.add(this._cancelButton, {row: 1, column: 0});
        
        this._createButton = new qx.ui.form.Button("Create");
        this._createButton.addListener("click", this.create, this);
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
            if(qx.core.Init.getApplication().getManager().getClass(newvalue).STUB) {
                this._stubArea.setCode(qx.core.Init.getApplication().getManager().getClass(newvalue).STUB);
            } else {
                this._stubArea.setCode(designer.util.Misc.simpleStub(newvalue));
            }
            return(newvalue);
        },
        create: function(e) {
            //this.debug("Adams, Well, I should be adding a " + this.getClassname() + " to " + this.getSelection() + ", with a special stub even:\n" + this._stubArea.getValue());
            qx.core.Init.getApplication().getManager().createLayoutObject(qx.lang.Json.parse(this._stubArea.getCode()), this.getSelection());
            this.close();
        }  
    }
});
