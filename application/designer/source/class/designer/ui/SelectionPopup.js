qx.Class.define("designer.ui.SelectionPopup",
{
  extend : qx.ui.popup.Popup,

  construct : function() {
    this.base(arguments, new qx.ui.layout.Dock());
	
	this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "north"});
	this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "east"});
	this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", height: 5}), {edge: "south"});
	this.add(new qx.ui.core.Widget().set({backgroundColor: "blue", width: 5}), {edge: "west"});
	this.add(new qx.ui.core.Widget().set({height: 50, width: 50}), {edge: "center"});
	this.set({opacity: 0.5, zIndex: 10});
  }
});