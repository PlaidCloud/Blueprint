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

// This class is designed to take the place of both a qx.ui.form.Form and a qx.data.controller.Form and manage form data in the blueprint data layer.
qx.Class.define("blueprint.data.controller.Form",
{
    extend : qx.data.controller.Form,

    include :
    [
    blueprint.MBlueprintManager
    ],

    construct : function(vData, namespace, skipRecursion)
    {
        var form = blueprint.util.Registry.getInstance().getByNamespace(namespace, vData.constructorSettings.model);
        this.base(arguments, null, form);
        
        this.set(vData.qxSettings);
        
        this.createModel();
    },

    properties :
    {
        
    },
    
    members :
    {
        
    }
});