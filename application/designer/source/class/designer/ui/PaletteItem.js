qx.Class.define("designer.ui.PaletteItem", {
    extend: qx.ui.basic.Image,

    properties: {
        clazz: {
            check: "String",
            apply: "_applyClazz"
        }
    },

    construct: function(clazz) {
        this.base(arguments);
        this.setClazz(clazz);
    },
        
    members: {
        _applyClazz: function(newClazz, oldClazz) {
            var realclazz = qx.core.Init.getApplication().getManager().getClass(newClazz);
            if (realclazz.icon) {
                this.setSource(realclazz.icon);
            } else {
                this.setSource("fugue/icons/user-silhouette-question.png");
            }
        }
    }
});
