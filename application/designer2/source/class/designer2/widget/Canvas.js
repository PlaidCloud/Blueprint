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

qx.Class.define("designer2.widget.Canvas",
{
    extend  : qx.ui.container.Composite,
    include :
    [
    designer2.blender.Selector
    ],

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */

    construct : function(layout)
    {
        this.base(arguments, layout);
        this.setBackgroundColor("#EEEEEE");
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