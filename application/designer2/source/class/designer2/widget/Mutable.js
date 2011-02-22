/* ************************************************************************

Tartan Blueprint Designer

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

qx.Class.define("designer2.widget.Mutable",
{
    extend  : designer2.widget.Simple,
    include :
    [
    qx.ui.core.MMovable,
    qx.ui.core.MResizable
    ],

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct : function(widget, custom, popupEdit)
    {
        if (!custom) {
            custom = { };
        }
        
        this.base(arguments, widget, custom);
        
        this.set({
            resizable: false,
            backgroundColor: "#eeeeee"
        });
        
        if (custom["draggable"]) {
            this._activateMoveHandle(this.getInnerBox());
        }
        
        this.addListener("move", function(e) {
            var layoutmap = blueprint.util.Misc.getDeepKey(this.getDesignerJson(), ["__designer2","layoutmap"]);
            qx.lang.Object.empty(layoutmap);
            qx.lang.Object.carefullyMergeWith(layoutmap, this.getLayoutProperties());
            
            qx.core.Init.getApplication().getChildControl("lSettings-textArea").setValue(qx.util.Json.stringify(this.getLayoutProperties(), true));
            
            designer2.data.Manager.getInstance().fireEvent("jsonUpdated");
        });
    },
    
    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
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