qx.Mixin.define("designer.util.MVResizable",
{
  include : [ qx.ui.core.MResizable ],

  construct : function() {
    this.setResizable([ false, false, true, false ]);
  }
});