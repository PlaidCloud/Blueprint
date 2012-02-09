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
        
        var editBtn = new qx.ui.toolbar.Button("Edit", "fugue/icons/application--pencil.png");
        var deleteBtn = new qx.ui.toolbar.Button("Delete", "fugue/icons/minus-circle.png");
        
        this.addListenerOnce("appear", function() {
        	editBtn.addListener("execute", this.__manager.getLayoutPage().editContents, this.__manager.getLayoutPage());
        	deleteBtn.addListener("execute", this.__manager.getLayoutPage().deleteSelection, this.__manager.getLayoutPage());
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
