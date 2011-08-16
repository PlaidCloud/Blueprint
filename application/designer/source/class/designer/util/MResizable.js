qx.Mixin.define("designer.util.MResizable",
{
  include : [ qx.ui.core.MResizable ],

  construct : function() {
    this.setResizable([ false, true, true, false ]);
  }
});