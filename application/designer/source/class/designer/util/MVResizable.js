qx.Mixin.define("designer.util.MVResizable",
{
	include : [ qx.ui.core.MResizable ],

  	members : {
		makeResizable : function() {
			this.setResizable([ false, false, true, false ]);
		}
	}
});