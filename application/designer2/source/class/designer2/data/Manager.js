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

qx.Class.define("designer2.data.Manager", {
    extend : qx.core.Object,
    type : "singleton",

    construct : function()
    {
        this.base(arguments);
        
        this.loadJson("admin.security.changepassword.json");
    },

    members :
    {
        __currentJson : null,
        __objectCounter : null,
        __topContainers : ["blueprint.TopContainer"],
        __topComponents : null,
        
        
        loadJson : function(jsonName)
        {
            var request = new qx.io.remote.Request("resource/designer2/import/" + jsonName, "GET", "application/json");
            this.__objectCounter = 0;
            this.__topComponents = {
                "layout" : {},
                "data" : {},
                "controllers" : [],
                "bindings" : [],
                "events" : [],
                "scripts" : {},
                "functions" : {}
            };

            request.addListener("completed", function(e) {
                var json = e.getContent();
                
                this.__currentJson = json;
                
                this.processJsonImport(json);
            }, this);

            request.send();
        },

        processJsonImport : function(json)
        {
            qx.core.Assert.assert(qx.lang.Array.contains(this.__topContainers, json["object"]["objectClass"]), "Top level object not in the manager's list of top containers.");
            this.__carefullyCreateTopKeys(json);
            
            
        },

        _processJsonImportWorker : function(json)
        {
            
        },
        
        __carefullyCreateTopKeys : function(json)
        {
            var object_keys = ["layout", "data", "scripts", "functions"];
            var array_keys = ["controllers", "bindings", "events"];
            
            for (var key in object_keys) {
                if (json[key] === undefined) {
                    json[key] = {};
                }
            }
            
            for (var key in array_keys) {
                if (json[key] === undefined) {
                    json[key] = [];
                }
            }
        }
    }
});
