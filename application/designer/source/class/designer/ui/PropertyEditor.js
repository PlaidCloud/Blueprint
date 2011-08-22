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


/** An editor for the properties of the selected object.
 */
qx.Class.define("designer.ui.PropertyEditor", {
    extend: qx.ui.container.SlideBar,

    /** Constructs the property editor.
     */
    construct: function() {
        this.base(arguments);
        
        this.setOrientation("vertical");
        this.setLayout(new qx.ui.layout.VBox);
        
        designer.core.manager.Selection.getInstance().addListener("changeSelection", this._refreshProperties, this);
    },

    properties: {
        /** The PropertyItem currently selected.
         */
        selectedItem: {
            check: "designer.ui.PropertyItem",
            nullable: true
        }
    },

    members: {
        /** a blacklist of properties that shouldn't be editable. Add to
         *  this when you find more.
         */
        _blacklist: {
            "generatedId": true,
            "blueprintNamespace": true,
            "decorator": true,
            "shadow": true
        },
        
        /** Goes through the properties of the selected object and
         *  displays them.
         *  @param e the event of the selected object changing
         */
        _refreshProperties: function(e) {
            var selectedId = e.getData().getGeneratedId();
            this.removeAll();
            var man = qx.core.Init.getApplication().getManager();
            var pl = e.getData().getProperties();
            for (var i=0; i < pl.length; i++) {
                if (!this._blacklist[pl[i]]) {
                    //this.debug("Adams, PropertyEditor, property: " + pl[i]);
                    //this.debug("Adams, PropertyEditor, selectedId: " + selectedId);
                    this.add(new designer.ui.PropertyItem(selectedId, pl[i], this));
                } 
            }
        },
        
        /** Goes through all of the displayed PropertyItems, and hides
         *  all of their selectors.
         */
        hideSelectors: function() {
            var children = this.getChildren();
            for (var i = 0; i<children.length; i++) {
                children[i].hideSelector();
            }
        },
        
        /** Sets the current selected property, and hides the selector of
         *  the previous selected property.
         *  @param item the new PropertyItem to be selected.
         */ 
        select: function(item) {
            if (this.getSelectedItem() !== null) {
                this.getSelectedItem().hideSelector();
            }
            
            this.setSelectedItem(item);
        }
    },

    destruct: function() {
    }
});
