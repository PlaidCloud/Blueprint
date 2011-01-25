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
        this.base(arguments, widget, custom);
        
        this.set({
            resizable: false
        });
        
        if (custom["draggable"]) {
            this._activateMoveHandle(this.getInnerBox());
        }
        
        this.addListener("mouseover", function(e) {
            this.setShadow("main");
        }, this);
        
        this.addListener("mouseout", function(e) {
            this.setShadow(null);
        }, this);
        
        this.addListenerOnce("appear", function(e) {
            if (typeof this.getLayoutParent().getLayout == "function") {
                var layout = this.getLayoutParent().getLayout().classname;
            } else {
                var layout = "";
            }
        }, this);
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