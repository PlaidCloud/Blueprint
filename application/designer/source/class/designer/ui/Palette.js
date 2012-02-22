qx.Class.define("designer.ui.Palette", {
    extend: qx.ui.toolbar.ToolBar,

    construct: function() {
        this.base(arguments);
        this.__manager = qx.core.Init.getApplication().getManager();
        
        this.set({
        	padding: [2,2,2,2]
        });
        
        this._getLayout().set({alignY:"middle"});
        
        this.add(new qx.ui.core.Spacer(5));
        this.add(new qx.ui.basic.Label("New Widgets:"));
        this.add(new qx.ui.core.Spacer(5));
        
        for (var i=0; i<this.__manager.getLayoutList().list.length; i++) {
           this.add(new designer.ui.PaletteItem(this.__manager.getLayoutList().list[i])); 
        }
        this.add(new qx.ui.toolbar.Separator());
        
		var cmdDelete = new qx.ui.core.Command("Control+Delete");
		cmdDelete.set({
			icon: "fugue/icons/minus-circle.png",
			label: "Delete"
		});
		
		var cmdEdit = new qx.ui.core.Command("Control+e");
		cmdEdit.set({
			icon: "fugue/icons/application--pencil.png",
			label: "Edit"
		});
		
        var editBtn = new qx.ui.toolbar.Button(null, null, cmdEdit);
        var deleteBtn = new qx.ui.toolbar.Button(null, null, cmdDelete);
        
        this.addListenerOnce("appear", function() {
        	cmdDelete.addListener("execute", function() {
				if (deleteBtn.getEnabled() && !qx.core.Init.getApplication().areWindowsOpen() && this.__manager.getTabView().getSelection()[0].getLabel() == "Layout") {
					this.__manager.getLayoutPage().deleteSelection.call(this.__manager.getLayoutPage());
				}
			}, this);
			
        	cmdEdit.addListener("execute", function() {
				if (editBtn.getEnabled() && !qx.core.Init.getApplication().areWindowsOpen() && this.__manager.getTabView().getSelection()[0].getLabel() == "Layout") {
					this.__manager.getLayoutPage().editContents.call(this.__manager.getLayoutPage());
				}
			}, this);
        }, this);
        
        designer.core.manager.Selection.getInstance().addListener("changeSelection", function(e) {
        	if (e.getData()) {
        		editBtn.setEnabled(qx.lang.Type.isFunction(qx.core.Init.getApplication().getEditContents(e.getData())));
        		deleteBtn.setEnabled(this.__manager.getSelection() != this.__manager.getRootLayoutObject());
        	} else {
        		editBtn.setEnabled(false); deleteBtn.setEnabled(false);
        	}
        }, this);
        
        this.add(new qx.ui.basic.Label("Selected Widget:"));
        
        this.add(editBtn);
        this.add(deleteBtn);
    },
    
    members: {
    	__manager: null
    }
});
