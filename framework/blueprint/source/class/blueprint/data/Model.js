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

qx.Class.define("blueprint.data.Model",
{
    extend : qx.core.Object,

    include :
    [
    blueprint.MBlueprintManager
    ],

    construct : function(vData, namespace, skipRecursion)
    {
        this.base(arguments);

        var value = null;

        if (vData.constructorSettings.value != undefined) {
            value = qx.data.marshal.Json.createModel(vData.constructorSettings.value, true);
            this.setValue(value);
        }
    },

    properties :
    {
        value : {
            init: null,
            event : "changeValue",
            nullable: true
        }
    }
});