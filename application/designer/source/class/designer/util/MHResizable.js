qx.Mixin.define("designer.util.MHResizable",
{
  include : [ qx.ui.core.MResizable ],

  construct : function() {
    this.setResizable([ false, true, false, false ]);
  }
});