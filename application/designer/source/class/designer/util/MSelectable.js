qx.Mixin.define("designer.util.MSelectable",
{
	construct : function() {
		this.addListener("mousedown", this.designerSelected, this);
	},
	
	members :
	{
		designerSelected : function(e) {
			var current = designer.core.manager.Selection.getInstance().getSelection();
			
			if (current !== this) {
				designer.core.manager.Selection.getInstance().setSelection(this);
				e.stopPropagation();
			}
		}
	}
});