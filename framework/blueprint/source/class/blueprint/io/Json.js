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

qx.Bootstrap.define("blueprint.io.Json", {
    type : "static",

    statics :
    {
        load : function(url, namespace, parent, layoutmap) {
            var request = new blueprint.io.remote.Request(url, "GET", "application/json");
            
            request.addListener("completed", function(e)
            {
                var newObject = blueprint.Manager.getInstance().generate(e.getContent(), null, namespace);
                
                this.setNewObject(newObject);
                
                if (qx.lang.Type.isFunction(parent.add)) {
                    parent.add(newObject, layoutmap);
                }
            }, this);
            
            request.send();
            
            return request;
        }
    }
});