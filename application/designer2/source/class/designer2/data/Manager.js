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
        
        this.importJson("admin.security.changepassword.json");
    },

    members :
    {
        __currentJson : null,
        __objectCounter : null,
        __topContainers : ["blueprint.TopContainer"],
        __objects : null,
        __objectIds : null,
        
        
        importJson : function(jsonName)
        {
            var request = new qx.io.remote.Request("resource/designer2/import/" + jsonName, "GET", "application/json");
            this.__objectCounter = 0;
            this.__objects = new qx.data.Array();
            this.__objectIds = {};

            request.addListener("completed", function(e) {
                var json = e.getContent()["object"];
                
                this.__currentJson = json;
                
                this.processJsonImport(json);
            }, this);

            request.send();
        },
        
        exportJson : function()
        {
            var exportJson = { "object": this.__currentJson };
            this.warn("Export:");
            this.warn(qx.util.Json.stringify(exportJson));
        },

        processJsonImport : function(json)
        {
            qx.core.Assert.assert(qx.lang.Array.contains(this.__topContainers, json["objectClass"]), "Top level object not in the manager's list of top containers.");
            this.__carefullyCreateTopKeys(json);
            
            this.__registerObject(json);
            
            if (qx.lang.Type.isObject(json["layout"])) {
                this.__processJsonImportWorker(json["layout"]);
            }
        },
        
        __processJsonImportWorker : function(json)
        {
            this.__registerObject(json);
            this.warn("registered " + json["objectClass"] + " // " + json["objectId"]);
            if (qx.lang.Type.isArray(json["contents"])) {
                for (i in json["contents"]) {
                    this.__processJsonImportWorker(json["contents"][i]["object"]);
                }
            }
        },
        
        __registerObject : function(json)
        {
            qx.core.Assert.assertString(json["objectClass"], "objectClass must be a string.");
            this.__objects[this.__objectCounter++] = json;
            if (qx.lang.Type.isString(json["objectId"]) && json["objectId"] != "") {
                qx.core.Assert.assertUndefined(this.__objectIds[json["objectId"]], "Cannot have two objects with the same objectId");
                this.__objectIds[json["objectId"]] = json;
            }
        },
        
        __carefullyCreateTopKeys : function(json)
        {
            var object_keys = ["layout", "data", "scripts", "functions"];
            var array_keys = ["controllers", "bindings", "events"];
            
            for (var key in object_keys) {
                if (!qx.lang.Type.isObject(json[object_keys[key]])) {
                    this.warn("{} ==> creating " + object_keys[key]);
                    json[object_keys[key]] = {};
                } else {
                    this.warn("{} ==> found " + object_keys[key]);
                }
            }
            
            for (var key in array_keys) {
                if (!qx.lang.Type.isArray(json[array_keys[key]])) {
                    this.warn("[] ==> creating " + array_keys[key]);
                    json[array_keys[key]] = [];
                } else {
                    this.warn("[] ==> found " + array_keys[key]);
                }
            }
        }
    }
});
