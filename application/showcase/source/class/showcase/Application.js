/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

/* ************************************************************************

#asset(showcase/*)

************************************************************************ */

/**
* This is the main application class of your custom application "showcase"
*/
qx.Class.define("showcase.Application",
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

            /*
            -------------------------------------------------------------------------
            Below is your actual application code...
            -------------------------------------------------------------------------
            */
            
            if (top.location.hash == "") {
                
            } else {
                alert(top.location.hash);
            }
            
            var rm = qx.util.ResourceManager.getInstance();
            alert(rm.getData("showcase/examples/SelectBox_1.json"));
        },
        
        getDefinition : function(defname)
        {
            var request = new qx.ui.remote.Request();
        }
    }
});
