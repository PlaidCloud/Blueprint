/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2009 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

/**
* This is the main application class of your custom application "blueprint"
*/
qx.Class.define("blueprint.Application",
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

            // Create a button
            // var button1 = new qx.ui.form.Button("First Button", "blueprint/test.png");

            var buttonObj = {
                "objectClass": "blueprint.ui.container.Composite",
                "objectId": "",
                "type": "top_container",
                "qxSettings": {

                },
                "constructorSettings": {
                    "innerLayout": "qx.ui.layout.Canvas" 
                },
                "scripts": {
                    "buttonListener": "$mybutton.addListener(\"execute\", function(e) {alert(\"Hello World!\");});" 
                },
                "contents": [
                {
                    "layoutmap": {
                        "top": 50,
                        "left": 50 
                    },
                    "object": {
                        "objectClass": "blueprint.ui.form.Button",
                        "objectId": "mybutton",
                        "type": "object",
                        "qxSettings": {
                            "label": "First Button" 
                        },
                        "constructorSettings": {

                        } 
                    } 
                } 
                ]
            };

            var test1 = blueprint.Manager.getInstance().generate(buttonObj, null, "hello_world", false);

            // Document is the application root
            var doc = this.getRoot();

            doc.add(test1, {top: 50, left: 50});

        }
    }
});
