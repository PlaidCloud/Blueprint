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
        
        this.__objects = new qx.data.Array();
        this.__objectParents = new qx.data.Array();
        
        this.importJson("admin.admin.member.json");
        //this.importJson("document.account.json");
    },

    properties :
    {
        designPage :
        {
            check: "designer2.page.Layout"
        },
        
        layoutHighlight :
        {
            check: "qx.ui.core.Widget",
            init: null,
            nullable: true,
            apply: "_setLayoutHighlight"
        }
    },

    members :
    {
        __currentJson : null,
        __objectCounter : null,
        __topContainers : ["blueprint.TopContainer"],
        __objects : null,
        __objectParents : null,
        __objectIds : null,
        __highlightOldColor : null,
        
        
        importJson : function(jsonName)
        {
            var request = new qx.io.remote.Request("resource/designer2/import/" + jsonName, "GET", "application/json");
            this.__objectCounter = 0;
            this.__objects.removeAll();
            this.__objectParents.removeAll();
            this.__objectIds = {};

            request.addListener("completed", function(e) {
                var json = e.getContent()["object"];
                
                this.__currentJson = json;
                
                this.processJsonImport(json);
            }, this);

            request.send();
        },
        
        getObjectArray : function()
        {
            return this.__objects;
        },
        
        exportJson : function()
        {
            for (var i=0;i<this.__objects.getLength();i++) {
                delete(this.__objects.getItem(i)["__designer2"]);
            }
            
            this.warn("Export: ");
            this.warn(qx.util.Json.stringify({ "object": this.__currentJson }, true));
        },

        processJsonImport : function(json)
        {
            qx.core.Assert.assert(qx.lang.Array.contains(this.__topContainers, json["objectClass"]), "Top level object not in the manager's list of top containers.");
            this.__carefullyCreateTopKeys(json);
            
            this.__registerObject(json, null, null, false);
            
            if (qx.lang.Type.isObject(json["layout"])) {
                this.__processJsonImportWorker(json["layout"], null, json, true);
            }
            
            if (qx.lang.Type.isObject(json["data"])) {
                //this.__processJsonImportWorker(json["data"], null, json, false);
            }
        },
        
        _setLayoutHighlight : function(value, old)
        {
            if (old) { old.setShadow(null); }
            
            value.setShadow("main");
            
            this.getDesignPage().getJsonArea().setValue(qx.util.Json.stringify(value.getDesignerJson()["qxSettings"], true));
        },
        
        __processJsonImportWorker : function(json, layoutmap, parent, isLayout)
        {
            this.__registerObject(json, layoutmap, parent, isLayout);
            //this.warn("registered " + json["objectClass"] + " // " + json["objectId"]);
            if (qx.lang.Type.isArray(json["contents"])) {
                for (var i in json["contents"]) {
                    this.__processJsonImportWorker(json["contents"][i]["object"], json["contents"][i]["layoutmap"], json, isLayout);
                }
            }
        },
        
        __registerObject : function(json, layoutmap, parent, isLayout)
        {
            qx.core.Assert.assertString(json["objectClass"], "objectClass must be a string.");
            
            this.__objects.setItem(this.__objectCounter, json);
            this.__objectParents.setItem(this.__objectCounter, parent);
            //this.warn(this.__objectCounter + " >> " + json["objectClass"]);
            if (qx.lang.Type.isString(json["objectId"]) && json["objectId"] != "") {
                qx.core.Assert.assertUndefined(this.__objectIds[json["objectId"]], "Cannot have two objects with the same objectId");
                this.__objectIds[json["objectId"]] = json;
            }
            
            blueprint.util.Misc.setDeepKey(json, ["__designer2","objectCounter"], this.__objectCounter);
            blueprint.util.Misc.setDeepKey(json, ["__designer2","parent"], parent);
            
            if (isLayout) {
                if (parent["objectClass"] == "blueprint.TopContainer") {
                    // This is the top layout level for this blueprint object.
                    // We need to create the top canvas and set up the layout page.
                    var objectList = new designer2.widget.ObjectList();
                    this.getDesignPage().setObjectList(objectList);
                    
                    var jsonArea = new designer2.widget.JsonArea();
                    this.getDesignPage().setJsonArea(jsonArea);
                    
                    var innerLayout = blueprint.util.Misc.generateLayout(blueprint.util.Misc.getDeepKey(json, ["constructorSettings", "innerLayout"]));
                    var qxObject = new designer2.widget.Canvas(innerLayout);
                    this.getDesignPage().setDesignCanvas(qxObject);
                    
                    blueprint.util.Misc.setDeepKey(json, ["__designer2","qxObject"], qxObject);
                } else {
                    // New blueprint object.
                    var qxObject = this.__buildBlendedObject(json, layoutmap, parent, isLayout);
                    
                    qxObject.setDesignerJson(json);
                    
                    blueprint.util.Misc.setDeepKey(json, ["__designer2","qxObject"], qxObject);
                    blueprint.util.Misc.setDeepKey(json, ["__designer2","layoutmap"], layoutmap);
                    
                    blueprint.util.Misc.getDeepKey(parent, ["__designer2","qxObject"]).add(qxObject, layoutmap);
                }
            }
            this.__objectCounter++;
        },
        
        __buildBlendedObject : function(json, layoutmap, parent, isLayout)
        {
            var mixins = this.__getObjectMixins(json, layoutmap, parent, isLayout);
            
            var clazz = qx.Class.getByName(json["objectClass"]);
            if (clazz != undefined) {
                for (var m=0;m<mixins.length;m++) {
                    qx.Class.include(clazz, mixins[m]);
                }
                
                return new clazz(json, "new_form", true);
            } else {
                throw new Error("Clazz not found for '" + json["objectClass"] + "'. All blueprint classes were not included. Try clearing your cache and run the generate source job?");
            }
        },
        
        __getObjectMixins : function(json, layoutmap, parent, isLayout)
        {
            var mixins = [designer2.blender.Selector];
            
            if (blueprint.util.Misc.getDeepKey(parent, ["constructorSettings","innerLayout"]) == "qx.ui.layout.Canvas") {
                mixins.push(qx.ui.core.MMovable);
                mixins.push(designer2.blender.Canvas);
            }
            
            return mixins;
        },
        
        __carefullyCreateTopKeys : function(json)
        {
            var object_keys = ["layout", "data", "scripts", "functions"];
            var array_keys = ["controllers", "bindings", "events"];
            
            for (var key in object_keys) {
                if (!qx.lang.Type.isObject(json[object_keys[key]])) {
                    //this.warn("{} ==> creating " + object_keys[key]);
                    json[object_keys[key]] = {};
                } else {
                    //this.warn("{} ==> found " + object_keys[key]);
                }
            }
            
            for (var key in array_keys) {
                if (!qx.lang.Type.isArray(json[array_keys[key]])) {
                    //this.warn("[] ==> creating " + array_keys[key]);
                    json[array_keys[key]] = [];
                } else {
                    //this.warn("[] ==> found " + array_keys[key]);
                }
            }
        }
    }
});
