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

qx.Class.define("designer2.data.Delegate", {
    extend : qx.core.Object,

    construct : function(json)
    {
        this.base(arguments);
    },
    
    properties :
    {
        objectClass:
        {
            check : "String"
        },
        
        objectId:
        {
            check : "String",
            init : null,
            nullable : true
        }
    },

    members :
    {
        
    }
});
