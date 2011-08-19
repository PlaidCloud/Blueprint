qx.Mixin.define("designer.util.MHResizable",
{
	include : [ qx.ui.core.MResizable ],

  	members : {
		makeResizable : function() {
			this.setResizable([ false, true, false, false ]);
		}
	}
});