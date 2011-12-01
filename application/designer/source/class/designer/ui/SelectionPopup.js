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
		
		this.addListener("mousedown", this.__mousedown, this);
		
		this.addListener("mousemove", this.__mousemove, this);
		
		this.addListener("dblclick", designer.core.manager.Selection.getInstance().clearSelection);
	},
	
	properties : {
		target : {
			check : "qx.ui.core.LayoutItem",
			apply : "_changeTarget",
			init: null,
			nullable: true
		},
		
		zIndex : {
			refine: true,
			init: 10
		}
	},
	
	members : {
		__previousTargetLayoutMap : null,
		__mouseIsDown : null,
		__previousOpacity : null,
		
		__mousemove : function(e) {
			//this.debug(e.getData());
		},
		
		__mousedown : function(e) {
			this.__mouseIsDown = true;
		},
		
		__moved : function(e) {
			var delta = {
				top  : e.getData().top - this.__previousTargetLayoutMap.top,
				left : e.getData().left - this.__previousTargetLayoutMap.left
			};
			if (this.__mouseIsDown) {
				this.__mouseIsDown = false;
				
				var target = this.getTarget();
				var coords = target.getLayoutProperties();
				
				if (qx.lang.Type.isNumber(coords.top) && qx.lang.Type.isNumber(coords.left)) {
					var newLayout = {
						top : coords.top + delta.top,
						left : coords.left + delta.left
					};
					target.setLayoutProperties(newLayout);
					qx.core.Init.getApplication().getManager().setLayoutProperties(target.getGeneratedId(), newLayout);
					
					this.__previousTargetLayoutMap = {
						top: this.__previousTargetLayoutMap.top + delta.top,
						left: this.__previousTargetLayoutMap.left + delta.left
					};
					
					designer.core.manager.Selection.getInstance().propertiesUpdated();
				}
			}
		},
		
		__resized : function(e) {
			var size = {
				width : this.getWidth(),
				height : this.getHeight()
			};
			
			this.getTarget().set(size);
			qx.core.Init.getApplication().getManager().setProperty(this.getTarget().getGeneratedId(), "width", this.getWidth());
			qx.core.Init.getApplication().getManager().setProperty(this.getTarget().getGeneratedId(), "height", this.getHeight());
			
			designer.core.manager.Selection.getInstance().propertiesUpdated();
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
			
			if (old) {
				this.removeListener("move", this.__moved);
				this.removeListener("resize", this.__resized);
			}
			
			if (value) {
				this.show();
				this.setZIndex(10);
				this.__placeToTarget(value);
				
				this.setMovable(false);
				this.setResizable([ false, false, false, false ]);
				
				if (qx.lang.Type.isFunction(value.getLayoutParent) && qx.lang.Type.isFunction(value.getLayoutParent().getLayout) && value.getGeneratedId() != qx.core.Init.getApplication().getManager().getRootLayoutObject()) {
					switch(value.getLayoutParent().getLayout().classname) {
						case "qx.ui.layout.Canvas":
						this.setMovable(true);
						this.setResizable([ false, true, true, false ]);
						break;
					}
				}
				
				this.addListener("move", this.__moved, this);
				this.addListener("resize", this.__resized, this);
			}
		}
	}
});