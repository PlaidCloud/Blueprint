qx.Mixin.define("designer.util.MResizable",
{
	include : [ qx.ui.core.MResizable ],

  	members : {
		makeResizable : function() {
			this.setResizable([ false, true, true, false ]);
		}
	}
});