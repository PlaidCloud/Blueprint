/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(designer/*)

************************************************************************ */

qx.Class.define("designer.Application",
{
  extend : qx.application.Standalone,
  
  properties :
  {
    manager :
    {
      check : "designer.core.manager.Abstract"
    }
  },

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     *
     * @return {void} 
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;

        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }
      var manager = designer.core.manager.Blueprint.getInstance();
      
      this.setManager(manager);
      manager.loadJson();
      
      var doc = this.getRoot();
      
      var tabview = new designer.ui.TabView();
      var layoutPage = new designer.ui.LayoutPage();
      tabview.add(layoutPage);
      
      manager.setLayoutPage(layoutPage);
      
      doc.add(tabview, {top: 2, right: 2, bottom: 2, left: 2});
      
      manager.addListener("jsonLoaded", function(e) {
        //var selector = new designer.selector.Int("obj1", "width");
        //doc.add(selector);
      
        //selector.show();
      });
      
    }
  }
});
