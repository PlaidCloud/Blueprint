/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

/* ************************************************************************

#asset(designer2/*)
#asset(qx/*)

************************************************************************ */

/**
* This is the main application class of your custom application "designer2"
*/
qx.Class.define("designer2.Application",
{
    extend : qx.application.Standalone,



    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        /**
        * This method contains the initial application code and gets called 
        * during startup of the application
        * 
        * @lint ignoreDeprecated(alert)
        */
        main : function()
        {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Variant.isSet("qx.debug", "on"))
            {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            // Document is the application root
            var doc = this.getRoot();

            var tabview = new qx.ui.tabview.TabView();
            
            doc.add(tabview, {top: 2, right: 2, bottom: 2, left: 2});
            doc.set({"backgroundColor": "#084C8E"});
            
            tabview.set({"barPosition": "left", "backgroundColor": "#084C8E"});

            var managePage = new qx.ui.tabview.Page("Manage", "icon/32/apps/office-writer.png");
            tabview.add(managePage);

            var designPage = new qx.ui.tabview.Page("Layout", "icon/32/apps/office-draw.png");
            tabview.add(designPage);
            
            //["data", "controllers", "bindings", "events", "scripts", "functions"]
            
            var dataPage = new qx.ui.tabview.Page("Data", "icon/32/apps/office-database.png");
            tabview.add(dataPage);
            
            designer2.data.Manager.getInstance();
        }
    }
});
