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
            
            var manager = designer2.data.Manager.getInstance();
            
            doc.add(this.__tabview, {top: 30, right: 2, bottom: 2, left: 2});
            doc.add(this.__toolbar, {top: 0, right: 0, left: 0});
            doc.set({"backgroundColor": "#084C8E"});
            
            this.__tabview.set({"barPosition": "left", "backgroundColor": "#084C8E"});

            var managePage = new qx.ui.tabview.Page("Manage", "icon/32/apps/office-writer.png");
            managePage.setLayout(new qx.ui.layout.Canvas());
            //this.__tabview.add(managePage);
            
            //var list = new designer2.widget.ObjectList();
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
                
                this.getRoot().add(control, {top: 30, left: 800});
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
                
                this.getRoot().add(control, {top: 30, left: 800});
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
                
                this.getRoot().add(control, {top: 30, left: 800});
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
                
                this.getRoot().add(control, {top: 30, left: 800});
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
        
        __applyLSettings : function(e) {
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
            
            try {
                selected.setLayoutProperties(replacementJson);
                blueprint.util.Misc.setDeepKey(selected.getDesignerJson(), ["__designer2","layoutmap"], replacementJson);
            } catch(e) {
                alert("Layout error: \n" + e);
            }
        },
        
        __applyQxSettings : function(e) {
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
        },
        
        __buildToolBar : function() {
            this.__toolbar.removeAll();
            var lbl_selected = new qx.ui.toolbar.Button("Selected: ");
            var list_selected = new qx.ui.toolbar.Button("-Some Object-");
            
            var btn_qxSettings = new qx.ui.toolbar.Button("qxSettings");
            btn_qxSettings.addListener("execute", function(e) { this.getChildControl("qxSettings").show(); }, this);
            
            var btn_cSettings = new qx.ui.toolbar.Button("constructorSettings");
            btn_cSettings.addListener("execute", function(e) { this.getChildControl("cSettings").show(); }, this);
            
            var btn_lSettings = new qx.ui.toolbar.Button("layoutSettings");
            btn_lSettings.addListener("execute", function(e) { this.getChildControl("lSettings").show(); }, this);
            
            var btn_sSettings = new qx.ui.toolbar.Button("serverSettings");
            btn_sSettings.addListener("execute", function(e) { this.getChildControl("sSettings").show(); }, this);
            
            var btn_selectParent = new qx.ui.toolbar.Button("Select Parent Object");
            btn_selectParent.addListener("execute", function(e) { alert("okay"); }, this);
            
            this.__toolbar.add(new qx.ui.core.Spacer(100));
            this.__toolbar.add(lbl_selected);
            this.__toolbar.add(list_selected);
            this.__toolbar.add(new qx.ui.toolbar.Separator());
            this.__toolbar.add(btn_qxSettings);
            this.__toolbar.add(btn_cSettings);
            this.__toolbar.add(btn_lSettings);
            this.__toolbar.add(btn_sSettings);
            this.__toolbar.add(new qx.ui.toolbar.Separator());
            this.__toolbar.add(btn_selectParent);
            
        }
    }
});
