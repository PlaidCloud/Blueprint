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
qx.Class.define("designer.ui.PropertyEditor", {
    extend: qx.ui.container.SlideBar,

    /** TODOC
     */
    construct: function() {
        this.base(arguments);
        //this.debug("making this");
        
        this.setOrientation("vertical");
        this.setLayout(new qx.ui.layout.VBox);
        
        designer.core.manager.Selection.getInstance().addListener("changeSelection", this._refreshProperties, this);
        this._propList = [];
    },

    properties: {
        selectedItem: {
            nullable: true
        }
    },

    members: {
        _selectedId: null,
        _blacklist: {
            "generatedId": true,
            "blueprintNamespace": true,
            "decorator": true,
            "shadow": true
        },
        _propList: null,
        _refreshProperties: function(e) {
            this._selectedId = e.getData().getGeneratedId();
            this._propList = [];
            this.removeAll();
            var man = qx.core.Init.getApplication().getManager();
            var pl = e.getData().getProperties();
            for (var i=0; i < pl.length; i++) {
                if (!this._blacklist[pl[i]]) {
                    this.debug("Adams, PropertyEditor, property: " + pl[i]);
                    this._propList.push(pl[i]);
                    //this.add(new qx.ui.basic.Label(pl[i]));
                    this.add(new designer.ui.PropertyItem(this._selectedId, pl[i], man.getProperty(this._selectedId, pl[i]), this));
                } 
            }
        },
        
        hideSelectors: function(except) {
            var children = this.getChildren();
            for (var i = 0; i<children.length; i++) {
                children[i].hideSelector();
            }
        },
        
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
