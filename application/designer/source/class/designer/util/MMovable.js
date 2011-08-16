qx.Mixin.define("designer.util.MMovable",
{
  include : [ qx.ui.core.MMovable ],

  construct : function() {
    this._activateMoveHandle(this);
  }
});