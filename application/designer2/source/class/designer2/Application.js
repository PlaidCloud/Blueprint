/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

/* ************************************************************************

#asset(designer2/*)
#asset(bcbsm_sample_1/*)
#asset(qx/*)

************************************************************************ */

/**
* This is the main application class of your custom application "designer2"
*/
qx.Class.define("designer2.Application",
{
    extend : qx.application.Standalone,

    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        __tabview : null,
        __toolbar : null,
        __childControls : null,
        __clipboardJson : null,
        __slbox_itemList : null,
        __btn_selected : null,
        
        /**
        * This method contains the initial application code and gets called 
        * during startup of the application
        * 
        * @lint ignoreDeprecated(alert)
        */
        main : function()
        {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Variant.isSet("qx.debug", "on"))
            {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            // Document is the application root
            var doc = this.getRoot();

            this.__tabview = new qx.ui.tabview.TabView();

            this.__toolbar = new qx.ui.toolbar.ToolBar();
            this.__toolbar.setHeight(28);
            this.__buildToolBar();
            this.__buildKeyboardCommands();
            
            var manager = designer2.data.Manager.getInstance();
            
            doc.add(this.__tabview, {top: 30, right: 2, bottom: 2, left: 2});
            doc.add(this.__toolbar, {top: 0, right: 0, left: 0});
            doc.set({"backgroundColor": "#084C8E"});
            
            this.__tabview.set({"barPosition": "left", "backgroundColor": "#084C8E"});

            var managePage = new qx.ui.tabview.Page("Manage", "icon/32/apps/office-writer.png");
            managePage.setLayout(new qx.ui.layout.Canvas());
            //this.__tabview.add(managePage);
            
            //managePage.add(list, {top: 50, left: 50});

            var designPage = new designer2.page.Layout();
            manager.setDesignPage(designPage);
            this.__tabview.add(designPage);
            
            //["data", "controllers", "bindings", "events", "scripts", "functions"]
            
            var dataPage = new qx.ui.tabview.Page("Data", "icon/32/apps/office-database.png");
            this.__tabview.add(dataPage);
            
            var button = new qx.ui.form.Button("export");
            button.addListener("execute", function(e) {
                manager.exportJson();
            });
            doc.add(button, {bottom:0, right: 0});
        },
        
        getChildControl : function(id, notcreate)
        {
            if (!this.__childControls)
            {
                if (notcreate) {
                    return null;
                }

                this.__childControls = {};
            }

            var control = this.__childControls[id];
            if (control) {
                return control;
            }

            if (notcreate === true) {
                return null;
            }

            return this._createChildControl(id);
        },
        
        _createChildControl : function(id)
        {
            if (!this.__childControls) {
                this.__childControls = {};
            } else if (this.__childControls[id]) {
                throw new Error("Child control '" + id + "' already created!");
            }

            var control = this._createChildControlImpl(id);

            if (!control) {
                throw new Error("Unsupported control: " + id);
            }

            return this.__childControls[id] = control;
        },
        
        _createChildControlImpl : function(id)
        {
            var control;

            switch(id)
            {
                // *******************************
                // bpSettings window section.
                // *******************************
                
                case "bpSettings":
                control = new qx.ui.window.Window("bpSettings");
                control.setLayout(new qx.ui.layout.Dock());

                control.set({
                    width: 400,
                    height: 300
                });

                var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                
                control.add(hbox, {edge: "south"});
                hbox.add(this.getChildControl("bpSettings-btnCancel"));
                
                this.getChildControl("bpSettings-btnCancel").addListener("execute", function(e) {
                    designer2.data.Manager.getInstance().setSelected(designer2.data.Manager.getInstance().getSelected());
                    control.hide();
                });
                this.getChildControl("bpSettings-btnApply").addListener("execute", this.__applyBpSettings);
                
                hbox.add(this.getChildControl("bpSettings-btnApply"));
                
                this.getRoot().add(control, {top: 30, left: 1000});
                break;
                
                case "bpSettings-btnCancel":
                control = new qx.ui.form.Button("Cancel");
                control.setEnabled(false);
                break;
                
                case "bpSettings-btnApply":
                control = new qx.ui.form.Button("Apply");
                control.setEnabled(false);
                break;
                
                // *******************************
                // qxSettings window section.
                // *******************************
                
                case "qxSettings":
                control = new qx.ui.window.Window("qxSettings");
                control.setLayout(new qx.ui.layout.Dock());

                control.set({
                    width: 400,
                    height: 300
                });

                var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                control.add(this.getChildControl("qxSettings-textArea"), {edge: "center"});
                control.add(hbox, {edge: "south"});
                hbox.add(this.getChildControl("qxSettings-btnCancel"));
                
                this.getChildControl("qxSettings-btnCancel").addListener("execute", function(e) {
                    designer2.data.Manager.getInstance().setSelected(designer2.data.Manager.getInstance().getSelected());
                    control.hide();
                });
                this.getChildControl("qxSettings-btnApply").addListener("execute", this.__applyQxSettings);
                
                hbox.add(this.getChildControl("qxSettings-btnApply"));
                
                this.getRoot().add(control, {top: 30, left: 1000});
                break;

                case "qxSettings-textArea":
                control = new qx.ui.form.TextArea();
                control.setEnabled(false);
                break;
                
                case "qxSettings-btnCancel":
                control = new qx.ui.form.Button("Cancel");
                control.setEnabled(false);
                break;
                
                case "qxSettings-btnApply":
                control = new qx.ui.form.Button("Apply");
                control.setEnabled(false);
                break;
                
                // *******************************
                // lSettings window section.
                // *******************************
                
                case "lSettings":
                control = new qx.ui.window.Window("layoutSettings");
                control.setLayout(new qx.ui.layout.Dock());

                control.set({
                    width: 400,
                    height: 300
                });

                var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                control.add(this.getChildControl("lSettings-textArea"), {edge: "center"});
                control.add(hbox, {edge: "south"});
                hbox.add(this.getChildControl("lSettings-btnCancel"));
                
                this.getChildControl("lSettings-btnCancel").addListener("execute", function(e) {
                    designer2.data.Manager.getInstance().setSelected(designer2.data.Manager.getInstance().getSelected());
                    control.hide();
                });
                this.getChildControl("lSettings-btnApply").addListener("execute", this.__applyLSettings);
                
                hbox.add(this.getChildControl("lSettings-btnApply"));
                
                this.getRoot().add(control, {top: 330, left: 1000});
                break;

                case "lSettings-textArea":
                control = new qx.ui.form.TextArea();
                control.setEnabled(false);
                break;
                
                case "lSettings-btnCancel":
                control = new qx.ui.form.Button("Cancel");
                control.setEnabled(false);
                break;
                
                case "lSettings-btnApply":
                control = new qx.ui.form.Button("Apply");
                control.setEnabled(false);
                break;
                
                
                // *******************************
                // cSettings window section.
                // *******************************
                
                case "cSettings":
                control = new qx.ui.window.Window("constructorSettings");
                control.setLayout(new qx.ui.layout.Dock());

                control.set({
                    width: 400,
                    height: 300
                });

                var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                control.add(this.getChildControl("cSettings-textArea"), {edge: "center"});
                control.add(hbox, {edge: "south"});
                hbox.add(this.getChildControl("cSettings-btnCancel"));
                
                this.getChildControl("cSettings-btnCancel").addListener("execute", function(e) {
                    designer2.data.Manager.getInstance().setSelected(designer2.data.Manager.getInstance().getSelected());
                    control.hide();
                });
                this.getChildControl("cSettings-btnApply").addListener("execute", this.__applyCSettings);
                
                hbox.add(this.getChildControl("cSettings-btnApply"));
                
                this.getRoot().add(control, {top: 330, left: 1000});
                break;

                case "cSettings-textArea":
                control = new qx.ui.form.TextArea();
                control.setEnabled(false);
                break;
                
                case "cSettings-btnCancel":
                control = new qx.ui.form.Button("Cancel");
                control.setEnabled(false);
                break;
                
                case "cSettings-btnApply":
                control = new qx.ui.form.Button("Apply");
                control.setEnabled(false);
                break;
                
                
                // *******************************
                // sSettings window section.
                // *******************************
                
                case "sSettings":
                control = new qx.ui.window.Window("serverSettings");
                control.setLayout(new qx.ui.layout.Dock());

                control.set({
                    width: 400,
                    height: 300
                });

                var hbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                control.add(this.getChildControl("sSettings-textArea"), {edge: "center"});
                control.add(hbox, {edge: "south"});
                hbox.add(this.getChildControl("sSettings-btnCancel"));
                
                this.getChildControl("sSettings-btnCancel").addListener("execute", function(e) {
                    designer2.data.Manager.getInstance().setSelected(designer2.data.Manager.getInstance().getSelected());
                    control.hide();
                });
                this.getChildControl("sSettings-btnApply").addListener("execute", this.__applySSettings);
                
                hbox.add(this.getChildControl("sSettings-btnApply"));
                
                this.getRoot().add(control, {top: 330, left: 1000});
                break;

                case "sSettings-textArea":
                control = new qx.ui.form.TextArea();
                control.setEnabled(false);
                break;
                
                case "sSettings-btnCancel":
                control = new qx.ui.form.Button("Cancel");
                control.setEnabled(false);
                break;
                
                case "sSettings-btnApply":
                control = new qx.ui.form.Button("Apply");
                control.setEnabled(false);
                break;
            }

            return control;
        },
        
        __applyBpSettings : function(e)
        {
            
        },
        
        __applyQxSettings : function(e)
        {
            var selected = designer2.data.Manager.getInstance().getSelected();
            var originalJson = selected.getDesignerJson()["qxSettings"];
            var replacementJson, widget;

            if (selected instanceof designer2.widget.Simple) {
                widget = selected.getTargetControl();
            } else {
                widget = selected;
            }

            try {
                replacementJson = qx.util.Json.parse(qx.core.Init.getApplication().getChildControl("qxSettings-textArea").getValue());
            } catch(e) {
                alert("Json parsing error: " + e);
            }

            // try/catch doesn't work on set() for some reason.
            widget.set(replacementJson);
            selected.getDesignerJson()["qxSettings"] = replacementJson;

            designer2.data.Manager.getInstance().setSelected(selected);
            
            designer2.data.Manager.getInstance().fireEvent("jsonUpdated");
        },
        
        __applyCSettings : function(e)
        {
            
        },
        
        __applyLSettings : function(e)
        {
            var selected = designer2.data.Manager.getInstance().getSelected();
            var originalJson = blueprint.util.Misc.getDeepKey(selected.getDesignerJson(), ["__designer2","layoutmap"]);
            var replacementJson, widget;
            
            if (selected instanceof designer2.widget.Simple) {
                widget = selected.getTargetControl();
            } else {
                widget = selected;
            }
            
            try {
                replacementJson = qx.util.Json.parse(qx.core.Init.getApplication().getChildControl("lSettings-textArea").getValue());
            } catch(e) {
                alert("Json parsing error: \n" + e);
            }
            
            // We let the "move" event handler actually update the manager's json.
            try {
                selected.setLayoutProperties(replacementJson);
            } catch(e) {
                alert("Layout error: \n" + e);
            }
        },
        
        __applySSettings : function(e)
        {
            
        },
        
        __activateWindow : function(winName)
        {
            this.getChildControl(winName).show();
            this.getChildControl(winName).setActive(true);
        },
        
        __addSelectedItem : function(itemName)
        {
            var items = designer2.data.Definitions.objects;
            var addSelection = this.__slbox_itemList.getSelection()[0].getLabel();
            var selected = designer2.data.Manager.getInstance().getSelected();
            
            if (selected && addSelection != "-" && items[addSelection]) {
                if (selected instanceof designer2.widget.Simple) {
                    alert("Cannot add to non-container object.");
                } else {
                    this.__addItem(items[addSelection], selected.getDesignerJson());
                }
            }
        },
        
        __addItem : function(newJson, parent)
        {
            //addObject : function(json, layoutmap, parent, isLayout)
            var newObject = designer2.data.Manager.getInstance().addObject(newJson, {}, parent, true);

            if (newObject) {
                designer2.data.Manager.getInstance().setSelected(newObject);
            }
        },
        
        __delItem : function(obj)
        {
            var selected = designer2.data.Manager.getInstance().getSelected().getDesignerJson();
            
            designer2.data.Manager.getInstance().delObject(selected);
        },
        
        updateSelection : function(obj)
        {
            var objectIndex = designer2.data.Manager.getInstance().getObjectIndex(obj.getDesignerJson());
            var objectId = obj.getDesignerJson()["objectId"];
            
            if (!objectId) { objectId = "-no objectId-"; }
            
            this.__btn_selected.setLabel("Object #" + objectIndex + " : " + objectId);
        },
        
        __cutItem : function()
        {
            var selected = designer2.data.Manager.getInstance().getSelected().getDesignerJson();
            
            designer2.data.Manager.getInstance().delObject(selected);
            
            this.__removeDesignerJson(selected);
            
            this.__clipboardJson = selected;
        },
        
        __removeDesignerJson : function(json)
        {
            json["objectId"] = "";
            delete(json["__designer2"]);
            
            if (json["contents"]) {
                for (var i=0;i<json["contents"].length;i++) {
                    this.__removeDesignerJson(json["contents"][i]["object"]);
                }
            }
        },
        
        __pasteItem : function()
        {
            if (this.__clipboardJson) {
                var selected = designer2.data.Manager.getInstance().getSelected();

                if (selected) {
                    if (selected instanceof designer2.widget.Simple) {
                        alert("Cannot add to non-container object.");
                    } else {
                        this.__addItem(qx.lang.Object.clone(this.__clipboardJson), selected.getDesignerJson());
                    }
                }
            }
        },
        
        __buildKeyboardCommands : function()
        {
            var cut = new qx.ui.core.Command("Ctrl+X");
            cut.addListener("execute", this.__cutItem, this);
            
            var paste = new qx.ui.core.Command("Ctrl+V");
            paste.addListener("execute", this.__pasteItem, this);
            
            var del = new qx.ui.core.Command("Ctrl+Backspace");
            del.addListener("execute", this.__delItem, this);
            
            var add = new qx.ui.core.Command("Ctrl+A");
            add.addListener("execute", this.__addSelectedItem, this);
            
            var selectParent = new qx.ui.core.Command("Ctrl+P");
            selectParent.addListener("execute", function(e) { designer2.data.Manager.getInstance().selectParent(); }, this);
        },
        
        __buildToolBar : function()
        {
            this.__toolbar.removeAll();
            
            this.__slbox_itemList = new qx.ui.form.SelectBox();
            this.__slbox_itemList.setWidth(200);
            
            this.__slbox_itemList.add(new qx.ui.form.ListItem("-"));
            var addItems = designer2.data.Definitions.objects;
            for (var i in addItems) {
                this.__slbox_itemList.add(new qx.ui.form.ListItem(i));
            }
            
            this.__btn_selected = new qx.ui.toolbar.Button("Object: -");
            this.__btn_selected.setWidth(200);
            
            var btn_bpSettings = new qx.ui.toolbar.Button("bpSettings");
            btn_bpSettings.addListener("execute", function(e) { this.__activateWindow("bpSettings"); }, this);
            
            var btn_qxSettings = new qx.ui.toolbar.Button("qxSettings");
            btn_qxSettings.addListener("execute", function(e) { this.__activateWindow("qxSettings"); }, this);
            
            var btn_cSettings = new qx.ui.toolbar.Button("constructorSettings");
            btn_cSettings.addListener("execute", function(e) { this.__activateWindow("cSettings"); }, this);
            
            var btn_lSettings = new qx.ui.toolbar.Button("layoutSettings");
            btn_lSettings.addListener("execute", function(e) { this.__activateWindow("lSettings"); }, this);
            
            var btn_sSettings = new qx.ui.toolbar.Button("serverSettings");
            btn_sSettings.addListener("execute", function(e) { this.__activateWindow("sSettings"); }, this);
            
            var btn_selectParent = new qx.ui.toolbar.Button("Select Parent Object");
            btn_selectParent.addListener("execute", function(e) { designer2.data.Manager.getInstance().selectParent(); }, this);
            
            var btn_addItem = new qx.ui.toolbar.Button("Add Item");
            btn_addItem.addListener("execute", this.__addSelectedItem, this);
            
            var btn_delItem = new qx.ui.toolbar.Button("Delete Item");
            btn_delItem.addListener("execute", this.__delItem, this);
            
            var chk_snapToGrid = new qx.ui.toolbar.CheckBox("Snap To Grid");
            chk_snapToGrid.setValue(designer2.data.Manager.getInstance().getSnapToGrid());
            chk_snapToGrid.bind("value", designer2.data.Manager.getInstance(), "snapToGrid");
            
            this.__toolbar.add(new qx.ui.core.Spacer(10));
            this.__toolbar.add(this.__slbox_itemList);
            this.__toolbar.add(btn_addItem);
            this.__toolbar.add(btn_delItem);
            this.__toolbar.add(new qx.ui.toolbar.Separator());
            this.__toolbar.add(btn_bpSettings);
            this.__toolbar.add(btn_qxSettings);
            this.__toolbar.add(btn_cSettings);
            this.__toolbar.add(btn_lSettings);
            this.__toolbar.add(btn_sSettings);
            this.__toolbar.add(new qx.ui.toolbar.Separator());
            this.__toolbar.add(this.__btn_selected);
            this.__toolbar.add(btn_selectParent);
            this.__toolbar.add(new qx.ui.toolbar.Separator());
            this.__toolbar.add(chk_snapToGrid);
            
            this.__activateWindow("qxSettings");
            this.__activateWindow("lSettings");
        }
    }
});
