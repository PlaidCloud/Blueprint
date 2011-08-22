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
		
		this.__mouseIsDown = false;
		
		this._activateMoveHandle(this);
		this.setResizable([ false, true, true, false ]);
		
		this.addListener("mousedown", this.__mousedown, this);
	},
	
	properties : {
		target : {
			check : "qx.ui.core.LayoutItem",
			apply : "_changeTarget"
		}
	},
	
	members : {
		__previousTargetLayoutMap : null,
		__mouseIsDown : null,
		
		__mousedown : function(e) {
			this.__mouseIsDown = true;
		},
		
		__movedOrResized : function(e) {
			this.debug("Moved or Resized!");
			var delta = {
				top  : e.getData().top - this.__previousTargetLayoutMap.top,
				left : e.getData().left - this.__previousTargetLayoutMap.left
			};
			if (this.__mouseIsDown) {
				this.__mouseIsDown = false;
				
				var target = this.getTarget();
				var coords = target.getLayoutProperties();
				
				if (qx.lang.Type.isNumber(coords.top) && qx.lang.Type.isNumber(coords.left)) {
					target.setLayoutProperties({
						top : coords.top + delta.top,
						left : coords.left + delta.left
					});
					
					this.__previousTargetLayoutMap = {
						top: this.__previousTargetLayoutMap.top + delta.top,
						left: this.__previousTargetLayoutMap.left + delta.left
					};
				}
			}
		},
		
		__placeToTarget : function(target) {
			var coords = target.getContainerLocation() || this.getLayoutLocation(target);
			this.placeToPoint(coords);
			
			if (qx.lang.Type.isNumber(coords.top) && qx.lang.Type.isNumber(coords.left)) {
				this.__previousTargetLayoutMap = {top: coords.top, left: coords.left};
			} else {
				this.__previousTargetLayoutMap = null;
			}
			
			this.set({
				width: target.getSizeHint().width,
				height: target.getSizeHint().height
			});
		},
		
		_changeTarget : function(value, old) {
			this.hide();
			this.debug("Target Changed to: " + value + " from " + old);
			
			if (old) {
				this.removeListener("move", this.__movedOrResized);
				this.removeListener("resize", this.__movedOrResized);
			}
			
			if (value) {
				this.show();
				this.__placeToTarget(value);
				
				if (qx.lang.Type.isFunction(value.getMovable)) {
					this.setMovable(value.getMovable());
				} else {
					this.setMovable(false);
				}
				
				if (qx.lang.Type.isFunction(value.getResizable)) {
					this.setResizable(value.getResizable());
				} else {
					this.setResizable([ false, false, false, false ]);
				}
				
				this.addListener("move", this.__movedOrResized, this);
				this.addListener("resize", this.__movedOrResized, this);
			}
		}
	}
});