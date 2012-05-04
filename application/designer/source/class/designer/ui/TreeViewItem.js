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
qx.Class.define("designer.ui.TreeViewItem", {
    extend: qx.ui.tree.VirtualTreeItem,
    
    construct : function(label) {
    	this.base(arguments, label);
    },

    properties: {
    	securityVisibility : {
    		check: "String",
    		init: "excluded",
    		event: "changeSecurityVisibility"
    	},
    	
    	securityBin : {
    		check: "String",
    		init: "",
    		event: "changeSecurityBin"
    	},
    	
        atomLabel: {
            check: "String",
            nullable: true,
            event: "changeAtomLabel"
        },
        
        atomIcon: {
            check: "String",
            nullable: true,
            event: "changeAtomIcon"
        },
        
        generatedId: {
            check: "String",
            nullable: true,
            event: "changeGeneratedId"
        },
        
        objectClass: {
            check: "String",
            nullable: true,
            event: "changeObjectClass"
        },
        
        objectId: {
            check: "String", 
            nullable: true,
            event: "changeObjectId"
        }
    },

    members: {
	    __manager: null,
	    __selBox: null,
	    
	    setSecuritySelection: function(group) {
	    	for (var i=0;i<this.__selBox.getChildren().length;i++) {
	    		if (group == this.__selBox.getChildren()[i].getLabel()) {
	    			this.__selBox.setSelection([this.__selBox.getChildren()[i]]);
	    			break;
	    		}
	    	}
	    },
	    
	    __changeSelBox: function(e) {
	    	this.warn('selboxChange');
	    	
	    	qx.core.Init.getApplication().getManager().setObjectSecurityGroup(this.getGeneratedId(), e.getData()[0].getLabel());
	    },
	    
        _addWidgets: function() {
            //TODO: come back here and make this look better
            //      Looks a bit better now, but could probably be improved.
            this.addListener("dblclick", this.__onDoubleClick, this);
            
            this.addSpacer();
            this.addOpenButton();
            
            this.__atom = new qx.ui.basic.Atom();
            this.bind("atomLabel", this.__atom, "label");
            this.bind("atomIcon", this.__atom, "icon");
            this.addWidget(this.__atom);
            
            this.addWidget(new qx.ui.core.Spacer(), {flex: 1});
            
            this.__selBox = new qx.ui.form.SelectBox();
            var controller = new qx.data.controller.List(qx.core.Init.getApplication().getManager().getSecurityPage().getSecurityGroupModel(), this.__selBox);
            this.bind("securityVisibility", this.__selBox, "visibility");
            
            this.__selBox.addListener("changeSelection", this.__changeSelBox, this);
            
            this.addWidget(this.__selBox);
            /*
            this.__genIdDisplay = new qx.ui.basic.Label();
            this.bind("generatedId", this.__genIdDisplay, "value");
            this.__genIdDisplay.setWidth(50);
            this.addWidget(this.__genIdDisplay);
            
            this.addWidget(new qx.ui.core.Spacer(), {flex: 1});

            this.__idDisplay = new qx.ui.basic.Label();
            this.bind("objectId", this.__idDisplay, "value");
            this.__idDisplay.setWidth(100);
            this.addWidget(this.__idDisplay);
        
            this.__classDisplay = new qx.ui.basic.Label();
            this.bind("objectClass", this.__classDisplay, "value");
            this.__classDisplay.setWidth(200);
            this.addWidget(this.__classDisplay);
            */
        },
        
        __genIdDisplay: null,        
        __idDisplay: null,
        __classDisplay: null,
        
        __onDoubleClick: function(e) {
            qx.core.Init.getApplication().getManager().setSelection(this.getGeneratedId());
        }
    }
});
