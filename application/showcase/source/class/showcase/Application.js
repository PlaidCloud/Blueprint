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
            if ((qx.core.Environment.get("qx.debug")))
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
            
            var doc = this.getRoot();
            this.__tabview = new qx.ui.tabview.TabView();
            doc.add(this.__tabview, {top: 2, right: 2, bottom: 2, left: 2});
            
            var reset = new qx.ui.form.Button("Reset");
            doc.add(reset, {top: 2, right: 2});
            reset.addListener("execute", function(e) {
                window.location = top.location.pathname + "#DefLoader.json";
                window.location.reload(true);
            });
            
            if (top.location.hash == "") {
                this.getDefinitions(["DefLoader.json"]);
            } else {
                var defs = top.location.hash.substring(1).split(",");
                
                this.getDefinitions(defs);
            }
        },
        
        getDefinitions : function(defnames)
        {
            for (var defname in defnames) {
                var request = new qx.io.remote.Request("resource/showcase/examples/" + defnames[defname], "GET", "application/json");
                var tabview = this.__tabview;
                request.__def = defname;

                request.addListener("completed", function(e) {
                    var page = new qx.ui.tabview.Page(defnames[this.__def]);
                    page.setLayout(new qx.ui.layout.Canvas());
                    tabview.add(page);
                    
                    var json = e.getContent()["object"];
                    
                    page.add(blueprint.Manager.getInstance().generate(json, null, defnames[this.__def], false).getLayoutObject(), {top: 5, right: 5, bottom: 5, left: 5});
                });

                request.send();
            }
        }
    }
});
