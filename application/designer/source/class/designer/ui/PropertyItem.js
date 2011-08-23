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


/** An Item used in the property editor. It shows the name of a property
 *  and it's value. If you click it, it'll get a selector to set the 
 *  value.
 */
qx.Class.define("designer.ui.PropertyItem", {
    extend: qx.ui.container.Composite,

    /** @param genID  The generated ID of the property's object.
     *  @param prop   The name of the property.
     *  @param editor The PropertyEditor this is part of.
     */
    construct: function(genID, prop, editor) {
        this.base(arguments);
        
        this._editor = editor;
        
        var layout = new qx.ui.layout.Grid();
        layout.setColumnWidth(0, 110);
        this.setLayout(layout);
        
        var val = qx.core.Init.getApplication().getManager().getProperty(genID, prop);
        
        //this.debug("Adams, PropertyItem, prop: " + prop);
        ///this.debug("Adams, PropertyItem, val: " + val);
        
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
        /** The generated ID of the object with the represented property
         */
        "generatedId" : {
            check: "String"
        },
        
        /** The name of the property.
         */
        "propname" : {
            check: "String",
            event: "changePropname"
        },
        
        /** The value of the property.
         */
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
        
        /** If there's no selector yet, creates one. If there is a
         *  selector, shows it. Also disables the click event, and asks
         *  the editor to hide any other selectors.
         */
        __onClick: function(e) {
            if (this._selector == null) {
                //I don't like the way I'm deciding which selector to use.
                var def = qx.core.Init.getApplication().getManager().getObjectPropertyDefinition(this.getGeneratedId(), this.getPropname());
                //this.debug("Adams, PropertyItem, check: " + def["check"]);
                if (def["check"] == "String") {
                    //this.debug("Adams, PropertyItem, detected String.");
                    this._selector = new designer.selector.String(this.getGeneratedId(), this.getPropname(), this);
                } else if (def["check"] == "Number" || def["check"] == "Integer") {
                    //this.debug("Adams, PropertyItem, detected Number.");
                    this._selector = new designer.selector.Float(this.getGeneratedId(), this.getPropname(), this);
                } else if (def["check"] == "Boolean") {
                    //this.debug("Adams, PropertyItem, detected Boolean");
                    this._selector = new designer.selector.Boolean(this.getGeneratedId(), this.getPropname(), this);
                } else if (def["check"] == "Color") {
                    this._selector = new designer.selector.Color(this.getGeneratedId(), this.getPropname(), this);
                } else {
                    //this.debug("Adams, PropertyItem, failed to detect");
                    this._selector = new designer.selector.Json(this.getGeneratedId(), this.getPropname(), this);
                }
            }
            this.add(this._selector, {row: 1, column: 0, colSpan: 2});
            
            this.removeListenerById(this._clickid);
            
            this._editor.select(this);
        },
        
        /** Hides the selector, and adds an event that shows the
         *  selector if the Item is clicked.
         */
        hideSelector: function() {
            this.remove(this._selector);
            
            this._clickid = this.addListener("click", this.__onClick, this);
        },
        
        jsonChanged: function() {
            this.setValue(String(qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), this.getPropname())));
        }
    },

    destruct: function() {
    }
});
