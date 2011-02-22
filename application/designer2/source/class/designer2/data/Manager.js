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
        this.__undoLog = true;
        
        //this.loadJsonFile("BCBSM_1.json");
        this.loadJsonFile("admin.admin.member.json");
        //this.loadJsonFile("document.account.json");
        
        this.addListener("jsonUpdated", function(e) {
            if (this.__undoLog) {
                //this.warn("Json was updated.");
            }
        });
    },

    events : {
        "jsonUpdated" : "qx.event.type.Event"
    },

    properties :
    {
        designPage :
        {
            check: "designer2.page.Layout"
        },
        
        selected :
        {
            check: "qx.ui.core.Widget",
            init: null,
            nullable: true,
            apply: "_setSelected"
        }
    },

    members :
    {
        __undoLog : null,
        __currentJson : null,
        __objectCounter : null,
        __topContainers : ["blueprint.TopContainer"],
        __objects : null,
        __objectParents : null,
        __objectIds : null,
        __highlightOldColor : null,
        __settingControls : [
            "bpSettings-btnCancel",
            "bpSettings-btnApply",
            "qxSettings-textArea",
            "qxSettings-btnCancel",
            "qxSettings-btnApply",
            "cSettings-textArea",
            "cSettings-btnCancel",
            "cSettings-btnApply",
            "lSettings-textArea",
            "lSettings-btnCancel",
            "lSettings-btnApply",
            "sSettings-textArea",
            "sSettings-btnCancel",
            "sSettings-btnApply"
        ],
        
        
        loadJsonFile : function(jsonName)
        {
            var request = new qx.io.remote.Request("resource/designer2/import/" + jsonName, "GET", "application/json");
            this.__objectCounter = 0;
            this.__objects.removeAll();
            this.__objectParents.removeAll();
            this.__objectIds = {};
            this.__undoLog = false;

            request.addListener("completed", function(e) {
                var json = e.getContent()["object"];
                
                this.__currentJson = json;
                
                this.processJsonImport(json);
                
                this.__undoLog = true;
            }, this);

            request.send();
        },
        
        exportJson : function()
        {
            for (var i=0;i<this.__objects.getLength();i++) {
                delete(this.__objects.getItem(i)["__designer2"]);
            }
            
            this.warn("Export: ");
            this.warn(qx.util.Json.stringify({ "object": this.__currentJson }, false));
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
        
        selectParent : function()
        {
            var selectedJson = this.getSelected().getDesignerJson();
            
            var parent = blueprint.util.Misc.getDeepKey(selectedJson, ["__designer2","parent","__designer2","qxObject"]);
            
            if (parent) {
                this.setSelected(parent);
            } else {
                alert("Top Level Layout Container Selected..");
            }
        },
        
        _setSelected : function(value, old)
        {
            if (old) { old.setShadow(null); }
            
            if (value) {
                value.setShadow("main");
                var app = qx.core.Init.getApplication();
                //app.getChildControl("bpSettings-stuff").setValue();
                app.getChildControl("qxSettings-textArea").setValue(qx.util.Json.stringify(value.getDesignerJson()["qxSettings"], true));
                app.getChildControl("cSettings-textArea").setValue(qx.util.Json.stringify(value.getDesignerJson()["constructorSettings"], true));
                app.getChildControl("lSettings-textArea").setValue(qx.util.Json.stringify(blueprint.util.Misc.getDeepKey(value.getDesignerJson(), ["__designer2","layoutmap"]), true));
                app.getChildControl("sSettings-textArea").setValue(qx.util.Json.stringify(value.getDesignerJson()["serverSettings"], true));
                
                var qxObject = value;
                if (qxObject instanceof designer2.widget.Simple) { qxObject = value.getTargetControl(); }
                
                app.getChildControl("bpSettings").setCaption("bpSettings - " + qxObject);
                app.getChildControl("qxSettings").setCaption("qxSettings - " + qxObject);
                app.getChildControl("cSettings").setCaption("constructorSettings - " + qxObject);
                app.getChildControl("lSettings").setCaption("layoutSettings - " + qxObject);
                app.getChildControl("sSettings").setCaption("serverSettings - " + qxObject);
                
                for (var i=0;i<this.__settingControls.length;i++) {
                    qx.core.Init.getApplication().getChildControl(this.__settingControls[i]).setEnabled(true);
                }
            } else {
                qx.core.Init.getApplication().getChildControl("qxSettings-textArea").setValue("");
                
                for (var i=0;i<this.__settingControls.length;i++) {
                    qx.core.Init.getApplication().getChildControl(this.__settingControls[i]).setEnabled(false);
                }
            }
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
                    
                    var innerLayout = blueprint.util.Misc.generateLayout(blueprint.util.Misc.getDeepKey(json, ["constructorSettings", "innerLayout"]));
                    var qxObject = new designer2.widget.Canvas(innerLayout);
                    
                    qxObject.setDesignerJson(json);
                    
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
        
        addObject : function(json, layoutmap, parent, isLayout)
        {
            var added = new Object();
            
            added["object"] = qx.lang.Object.clone(json);
            
            if (layoutmap) {
                added["layoutmap"] = qx.lang.Object.clone(layoutmap);
            }
            
            this.__registerObject(added["object"], added["layoutmap"], parent, isLayout);
            
            parent["contents"].push(added);
            
            this.fireEvent("jsonUpdated");
        },
        
        __buildBlendedObject : function(json, layoutmap, parent, isLayout)
        {
            var mixins = this.__getObjectMixins(json, layoutmap, parent, isLayout);
            var clazz = qx.Class.getByName(json["objectClass"]);
            
            if (qx.lang.Type.isArray(json["contents"])) {
                if (clazz != undefined) {
                    for (var m=0;m<mixins.length;m++) {
                        qx.Class.include(clazz, mixins[m]);
                    }

                    return new clazz(json, "new_form", true);
                } else {
                    throw new Error("Clazz not found for '" + json["objectClass"] + "'. All blueprint classes were not included. Try clearing your cache and run the generate source job?");
                }
            } else {
                if (clazz != undefined) {
                    var custom = {"draggable": false};
                    if (blueprint.util.Misc.getDeepKey(parent, ["constructorSettings","innerLayout"]) == "qx.ui.layout.Canvas") { custom["draggable"] = true; }

                    var wrapper = new designer2.widget.Mutable(new clazz(json, "new_form", true), custom);

                    return wrapper;
                } else {
                    throw new Error("Clazz not found for '" + json["objectClass"] + "'. All blueprint classes were not included. Try clearing your cache and run the generate source job?");
                }
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
