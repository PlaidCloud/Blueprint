qx.Class.define("designer.ui.SelectionPopup",
{
	extend : qx.ui.popup.Popup,
	include : [
	qx.ui.core.MMovable,
	qx.ui.core.MResizable
	],
	
	construct : function() {
		this.base(arguments, new qx.ui.layout.Dock());
		this.__manager = qx.core.Init.getApplication().getManager();
		
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "north"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "east"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "south"});
		this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "west"});
		this.add(new qx.ui.core.Widget().set({height: 50, width: 50}), {edge: "center"});
		this.set({opacity: 0.5, autoHide: false});
		
		this.__mouseIsDown = false;
		
		this.__timer = new qx.event.Timer(10);
		
		this._activateMoveHandle(this);
		
		this.addListener("mousedown", this.__mousedown, this);
		this.addListener("mousemove", this.__mousemove, this);
		
		this.addListener("changeZIndex", this.__zIndex, this);
		this.addListener("move", this.__moved, this);
		this.addListener("resize", this.__resized, this);
		
		this.__manager.addListenerOnce("jsonLoaded", function() {
			this.addListener("dblclick", this.__manager.getLayoutPage().editContents);
		}, this);
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
		
		redraw : function() {
			this._changeTarget(this.getTarget());
		},
		
		__zIndex : function(value, old) {
			if (value != 10) {
				this.setZIndex(10);
			}
		},
		
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
					
					this.__manager.setLayoutProperties(target.getGeneratedId(), newLayout);
					
					this.__previousTargetLayoutMap = {
						top: this.__previousTargetLayoutMap.top + delta.top,
						left: this.__previousTargetLayoutMap.left + delta.left
					};
					
					//designer.core.manager.Selection.getInstance().propertiesUpdated();
				}
			}
		},
		
		__resized : function(e) {
			var size = {
				width : this.getWidth(),
				height : this.getHeight()
			};
			
			var target = this.getTarget();
			var targetSize = {
				width: target.getWidth(),
				height: target.getHeight()
			};
			
			if (size.width != targetSize.width || size.height != targetSize.height) {
				this.getTarget().set(size);
				this.__manager.setProperty(this.getTarget().getGeneratedId(), "width", this.getWidth());
				this.__manager.setProperty(this.getTarget().getGeneratedId(), "height", this.getHeight());
				
				designer.core.manager.Selection.getInstance().propertiesUpdated();
			}
			
			this.__animatePosition();
		},
		
		__placeToTarget : function(target) {
			var coords = target.getContainerLocation() || this.getLayoutLocation(target);
			this.myPlaceToPoint(coords);
			
			if (qx.lang.Type.isNumber(coords.top) && qx.lang.Type.isNumber(coords.left)) {
				this.__previousTargetLayoutMap = {top: coords.top, left: coords.left};
			} else {
				this.__previousTargetLayoutMap = null;
			}
		},
		
		/*
		overloading qx.ui.core.MPlacement#placeToPoint
		*/
		
		myPlaceToPoint : function(point)
		{
			var coords =
			{
				left: point.left,
				top: point.top,
				right: point.left,
				bottom: point.top
			};

			this.__myPlace(coords);
		},
		
		/*
		overloading qx.ui.core.MPlacement#__getPlacementSize
		*/
		
		__myGetPlacementSize : function(callback)
		{
			var size = null;

			if (this._computePlacementSize) {
				var size = this._computePlacementSize();
			} else if (this.isVisible()) {
				var size = this.getBounds();
			}

			if (size == null)
			{
				this.addListenerOnce("appear", function() {
					this.__myGetPlacementSize(callback);
				}, this);
			} else {
				callback.call(this, size);
			}
		},
		
		/*
		overloading qx.ui.core.MPlacement#__place
		*/
		
		__myPlace : function(coords)
		{
			this.__myGetPlacementSize(function(size)
			{
				var result = qx.util.placement.Placement.compute(
					size,
					{left:0,top:0,width:99999,height:99999},
					coords,
					this._getPlacementOffsets(),
					this.getPosition(),
					this.getPlacementModeX(),
					this.getPlacementModeY()
				);

				this.moveTo(result.left, result.top);
			});
		},
		
		__animatePosition : function() {
			var target = this.getTarget();
			qx.event.Timer.once(function() {
				this.__placeToTarget(target);
				var b = target.getBounds();
				this.set({
					width: b.width,
					height: b.height
				});
				this.show();
			}, this, 5);
		},
		
		_changeTarget : function(value, old) {
			this.hide();
			
			if (value) {
				this.__animatePosition();
				
				this.setMovable(false);
				this.setResizable([ false, false, false, false ]);
				
				if (qx.lang.Type.isFunction(value.getLayoutParent) && qx.lang.Type.isFunction(value.getLayoutParent().getLayout) && value.getGeneratedId() != this.__manager.getRootLayoutObject()) {
					switch(value.getLayoutParent().getLayout().classname) {
						case "qx.ui.layout.Canvas":
						this.setMovable(true);
						this.setResizable([ false, true, true, false ]);
						break;
					}
				}
				if (value.getGeneratedId() == this.__manager.getRootLayoutObject()) { this.setResizable([ false, true, true, false ]); }
			}
		}
	}
});