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
qx.Class.define("designer.ui.PropertyItem", {
    extend: qx.ui.container.Composite,

    /** TODOC
     */
    construct: function(genID, prop, val, editor) {
        this.base(arguments);
        
        this._editor = editor;
        
        var layout = new qx.ui.layout.Grid();
        layout.setColumnWidth(0, 110);
        this.setLayout(layout);
        
        this.debug("Adams, PropertyItem, prop: " + prop);
        this.debug("Adams, PropertyItem, val: " + val);
        
        this.setGeneratedId(genID);
        this.setPropname(prop);
        this.setValue(String(val));
        
        this._proplabel = new qx.ui.basic.Label();
        this._vallabel = new qx.ui.basic.Label();
        
        this.bind("propname", this._proplabel, "value");
        this.bind("value", this._vallabel, "value");
        
        this.add(this._proplabel, {row: 0, column: 0});
        this.add(this._vallabel,  {row: 0, column: 1});
        
        this._clickid = this.addListener("click", this.__onClick, this);
    },

    properties: {
        "generatedId" : {
            check: "String"
        },
        
        "propname" : {
            check: "String",
            event: "changePropname"
        },
        
        "value": {
            event: "changeValue"
        }
    },

    members: {
        _proplabel: null,
        _vallabel: null,
        _clickid: null,
        _selector: null,
        _editor: null,
        
        __onClick: function(e) {
            if (this._selector == null) {
                //I don't like the way I'm deciding which selector to use.
                var def = qx.core.Init.getApplication().getManager().getObjectPropertyDefinition(this.getGeneratedId(), this.getPropname());
                this.debug("Adams, PropertyItem, check: " + def["check"]);
                if (def["check"] == "String") {
                    this.debug("Adams, PropertyItem, detected String.");
                    this._selector = new designer.selector.String(this.getGeneratedId(), this.getPropname());
                    this.add(this._selector, {row: 1, column: 0, colSpan: 2});
                } else if (def["check"] == "Number" || def["check"] == "Integer") {
                    this.debug("Adams, PropertyItem, detected Number.");
                    this._selector = new designer.selector.Float(this.getGeneratedId(), this.getPropname());
                    this.add(this._selector, {row: 1, column: 0, colSpan: 2});
                } else if (def["check"] == "Boolean") {
                    this.debug("Adams, PropertyItem, detected Boolean");
                    this._selector = new designer.selector.Boolean(this.getGeneratedId(), this.getPropname());
                    this.add(this._selector, {row: 1, column: 0, colSpan: 2});
                } else {
                    this.debug("Adams, PropertyItem, failed to detect");
                    this._selector = new designer.selector.Json(this.getGeneratedId(), this.getPropname());
                    this.add(this._selector, {row: 1, column: 0, colSpan: 2});
                }
            } else {
                this.add(this._selector, {row: 1, column: 0, colSpan: 2});
            }
            
            this.removeListenerById(this._clickid);
            
            //this._editor.hideSelectors(this.getPropname());
            this._editor.select(this);
        },
        
        hideSelector: function() {
            this.remove(this._selector);
            
            this._clickid = this.addListener("click", this.__onClick, this);
        }
    },

    destruct: function() {
    }
});
