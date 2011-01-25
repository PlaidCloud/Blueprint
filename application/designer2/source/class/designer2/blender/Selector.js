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
* Provides blueprintManager functionality to any widget.
*/
qx.Mixin.define("designer2.blender.Selector",
{
    construct : function(vData, namespace, skipRecursion)
    {
        qx.event.Registration.removeAllListeners(this);
        
        this.addListener("click", function(e) {
            this.warn("clicked on " + this);
            
            designer2.data.Manager.getInstance().setLayoutHighlight(this);
            
            e.stopPropagation();
        });
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        innerBox :
        {
            check: "qx.ui.core.Widget",
            init: null
        },
        
        designerJson :
        {
            check: "Object"
        }
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {

    },

    /*
    *****************************************************************************
    DESTRUCTOR
    *****************************************************************************
    */

    destruct : function()
    {

    }
});
