qx.Class.define("designer.ui.LayoutPage",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Layout");
    
    this.setLayout(new qx.ui.layout.Canvas());
  }
  
  
});