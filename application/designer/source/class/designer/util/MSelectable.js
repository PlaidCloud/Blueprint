qx.Mixin.define("designer.util.MSelectable",
{
	construct : function() {
		this.addListener("mousedown", this.designerSelected, this);
	},
	
	members :
	{
		designerSelected : function(e) {
			designer.core.manager.Selection.getInstance().setSelection(this);
			e.stopPropagation();
		}
	}
});