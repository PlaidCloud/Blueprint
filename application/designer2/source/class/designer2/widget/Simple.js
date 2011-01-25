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

qx.Class.define("designer2.widget.Simple",
{
    extend  : qx.ui.core.Widget,

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    /**
    * @param vData {Object}
    *   The JSON object describing this widget.
    */
    construct : function(widget, custom)
    {
        if (!custom) {
            custom = { };
        }
        
        this.base(arguments);
        this._setLayout(new qx.ui.layout.Canvas());

        if (custom["droppable"]) {
            // This widget is a container widget.
            this.setDroppable(true);

            this.addListener("drop", function(e) {
                e.stopPropagation();
            }, this);
        } else {
            // This is not a container widget.
            this.setInnerBox(new qx.ui.core.Widget());

            widget.setZIndex(-1);

            this._add(this.getInnerBox(), {left: 0, top: 0, right: 0, bottom: 0});
        }

        this._add(widget, {left: 0, top: 0, right: 0, bottom: 0});
        this.setTargetControl(widget);

        this.addListener("click", function(e) {
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
        targetControl :
        {
            check: "qx.ui.core.LayoutItem"
        },

        innerBox :
        {
            check: "qx.ui.core.Widget",
            init: null
        },

        myJson :
        {
            check: "Integer"
        }
    },

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        add : function(child, options)
        {
            if (typeof this.getTargetControl().add == "function"){
                this.getTargetControl().add(child, options);
            } else {
                this.warn('this.add called on widget without .add function.');
            }
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