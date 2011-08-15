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

qx.Class.define("designer2.page.Layout",
{
    extend  : qx.ui.tabview.Page,

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct : function(label, icon)
    {
        this.base(arguments, "Layout", "icon/32/apps/office-draw.png");
        this.setLayout(new qx.ui.layout.Canvas());

    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        designCanvas :
        {
            check: "designer2.widget.Canvas",
            apply: "_setDesignCanvas"
        }
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        _setDesignCanvas : function(value, old)
        {
            if (old) {
                old.removeAll();
                this.remove(old);
            }
            
            this.add(value, {top: 0, right: 0, bottom: 0, left: 0});
        },
        
        loadObject : function(json)
        {
            
        }
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