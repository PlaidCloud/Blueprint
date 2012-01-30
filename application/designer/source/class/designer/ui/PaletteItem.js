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
        this.setDraggable(true);
        this.addListener("dragstart", function(e) {
            e.addAction("move");
            e.addType("designer/object");
        });
        this.addListener("droprequest", function(e) {
            var type = e.getCurrentType();

            if (type == "designer/object") {
                var clazz = this.getClazz();
                var rn = qx.core.Init.getApplication().getManager().newDropId();
                e.addData(type, [clazz, rn]);
            }
        });
    },
        
    members: {
        _applyClazz: function(newClazz, oldClazz) {
            var realclazz = qx.core.Init.getApplication().getManager().getClass(newClazz);
            if (!realclazz) {
                this.debug(newClazz + " does not exist.");
            }
            if (realclazz && realclazz.icon) {
                this.setSource(realclazz.icon);
            } else {
                this.setSource("fugue/icons/user-silhouette-question.png");
            }
        }
    }
});
