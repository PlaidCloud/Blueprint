qx.Class.define("designer.ui.SelectionPopup",
{
	extend : qx.ui.popup.Popup,
	include : [
	qx.ui.core.MMovable,
	qx.ui.core.MResizable
	],
	
	construct : function() {
		this.base(arguments, new qx.ui.layout.Dock());
		
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "north"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "east"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "south"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "west"});
		this.add(new qx.ui.core.Widget().set({height: 50, width: 50}), {edge: "center"});
		this.set({opacity: 0.5, zIndex: 10});
		
		this._activateMoveHandle(this);
		this.setResizable([ false, true, true, false ]);
		
		this.addListener("move", this.__movedOrResized, this);
		this.addListener("resize", this.__movedOrResized, this);
	},
	
	properties : {
		target : {
			check : "qx.ui.core.LayoutItem",
			apply : "_changeTarget"
		}
	},
	
	members : {
		__movedOrResized : function(e) {
			this.debug("Moved or Resized!");
		},
		
		_changeTarget : function(value, old) {
			this.debug("Target Changed to: " + value);
		}
	}
});