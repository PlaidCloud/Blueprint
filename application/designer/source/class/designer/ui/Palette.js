qx.Class.define("designer.ui.Palette", {
    extend: qx.ui.container.Composite,

    construct: function() {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.HBox());
        //this.add(new qx.ui.basic.Label("Palette goes here"));
        this.add(new designer.ui.PaletteItem(""));
        this.add(new designer.ui.PaletteItem(""));
    }
});
