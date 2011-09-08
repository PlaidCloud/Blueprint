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
qx.Class.define("blueprint.Application", {
    extend: qx.application.Standalone,

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members: {
        /**
        * This method contains the initial application code and gets called 
        * during startup of the application
        */
        main: function() {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if ((qx.core.Environment.get("qx.debug"))) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            /*
            -------------------------------------------------------------------------
            No code for the framework app...
            -------------------------------------------------------------------------
            */
        }
    }
});
