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

qx.Class.define("blueprint.ui.container.Composite",
{
    extend : qx.ui.container.Composite,

    include :
    [
    blueprint.MBlueprintManager
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
    construct : function(vData, namespace, skipRecursion)
    {
        var new_layout = blueprint.util.Misc.generateLayout(vData.constructorSettings.innerLayout);

        if (vData.constructorSettings.layoutSettings) { new_layout.set(vData.constructorSettings.layoutSettings); }

        this.base(arguments, new_layout);

        this.set(vData.qxSettings);
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
        // Base constructor generation case.
        _generateConstructorDef : function()
        {
            var def = {
                innerLayout : {
                    type: "enum",
                    check: [qx.ui.layout.Canvas, qx.ui.layout.Dock, qx.ui.layout.Grid, qx.ui.layout.HBox, qx.ui.layout.VBox]
                }
            };

            return def;
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