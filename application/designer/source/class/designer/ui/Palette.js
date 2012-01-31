qx.Class.define("designer.ui.Palette", {
    extend: qx.ui.container.Composite,

    construct: function() {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.HBox().set({spacing: 3}));
        //this.setBackgroundColor("silver");
        for (var i=0; i<qx.core.Init.getApplication().getManager().getLayoutList().list.length; i++) {
           this.add(new designer.ui.PaletteItem(qx.core.Init.getApplication().getManager().getLayoutList().list[i])); 
        }
        //this.add(new designer.ui.PaletteItem("blueprint.ui.form.Button"));
        //this.add(new designer.ui.PaletteItem("blueprint.ui.form.TextArea"));
    }
});
