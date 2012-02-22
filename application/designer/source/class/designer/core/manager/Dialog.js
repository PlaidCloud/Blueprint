/* ************************************************************************

Plaid Application Toolkit

http://www.tartansolutions.com

Copyright:
2008 Tartan Solutions, Inc

License:
GPL: http://www.gnu.org/licenses/gpl.html
or
Commercial - Visit www.tartansolutions.com for details on obtaining a valid license
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

/* ************************************************************************

************************************************************************ */

/**
* This widget represents an image.
*
* @appearance image
*/
qx.Class.define("designer.core.manager.Dialog", {
    extend: qx.core.Object,

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    construct: function() //vText, vButtons, vIcons, vFunctions
    {
        this.__dialogQueue = new Array();
        this.__application = qx.core.Init.getApplication();
        this.__currentDialog = null;
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties: {

},

    members: {
        __currentDialog: null,
        __dialogQueue: null,
        __application: null,

        display: function(vData) {
        	if (qx.lang.Type.isString(vData)) {
        		vData = {
        			message: vData
        		};
        	}
        	
            var tempDialog = new designer.ui.Dialog(vData);
            tempDialog.setDialogManager(this);

            if (this.__currentDialog == null) {
                this.__currentDialog = tempDialog;
                qx.core.Init.getApplication().modalOn();
                tempDialog.show();
            } else {
                this.__dialogQueue.push(tempDialog);
                this.__currentDialog.setQueueNumber(this.__dialogQueue.length + 1);
            }
        },

        dismiss: function() {
            if (this.__currentDialog instanceof qx.ui.window.Window) {
                this.__currentDialog.close();
                if (this.__dialogQueue.length == 0) {
                    this.__currentDialog = null;
                    qx.core.Init.getApplication().modalOff();
                } else {
                    this.__currentDialog = this.__dialogQueue.shift();
                    this.__currentDialog.show();
                    this.__currentDialog.setQueueNumber(this.__dialogQueue.length + 1);
                }
            }
        },
        
        areWindowsOpen : function() {
        	if (this.__currentDialog) {
        		return this.__currentDialog.isVisible();
        	} else {
        		return false;
        	}
        }
    }
});
