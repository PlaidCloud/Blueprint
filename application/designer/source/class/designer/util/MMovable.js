qx.Mixin.define("designer.util.MMovable",
{
	include : [ qx.ui.core.MMovable ],

	members : {
		makeMovable : function() {
			this._activateMoveHandle(this);
		}
	}
});