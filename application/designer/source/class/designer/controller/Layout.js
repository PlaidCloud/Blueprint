/* ************************************************************************

Tartan Blueprint Designer

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

qx.Class.define("designer.controller.Layout",
{
	extend  : qx.ui.container.Composite,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function()
	{
		this.base(arguments, new qx.ui.layout.Canvas());
		
		this.set({
			width: 250,
			height: 320
		});
		this.__initControls();
		
		this.enableControls(false);
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		objectTree :
		{
			check: "designer.tree.Tree"
		},
		
		activeControls :
		{
			check: "Object",
			init: {}
		},
		
		activeLayoutControls :
		{
			check: "Object",
			init: {}
		},
		
		activeLayoutMode:
		{
			check: "String",
			init: ""
		},
		
		layoutControls :
		{
			check: "Object"
		},
		
		commonControls :
		{
			check: "Object"
		},
		
		enableUpdateEvents:
		{
			check: "Boolean",
			init: true
		},
		
		gridStep:
		{
			check: "Integer",
			init: 10
		}
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
        __dockArray : null,
        
		__initControls : function()
		{
			var gridStep = 10;
			
			var layoutControls = new Object();
			
			var canvas_controls = {
				checkbox: {
					top: new qx.ui.form.CheckBox("Top"),
					right: new qx.ui.form.CheckBox("Right"),
					bottom: new qx.ui.form.CheckBox("Bottom"),
					left: new qx.ui.form.CheckBox("Left")
				},
				widget: {
					top: new qx.ui.form.Spinner(-99999, null, 99999),
					right: new qx.ui.form.Spinner(-99999, null, 99999),
					bottom: new qx.ui.form.Spinner(-99999, null, 99999),
					left: new qx.ui.form.Spinner(-99999, null, 99999)
				}
			};
			
			for (var i in canvas_controls.checkbox) {
				canvas_controls.checkbox[i].addListener("changeValue", this.widgetEnabler, this);
				canvas_controls.checkbox[i].addListener("click", this.widgetEnabler, this);
				canvas_controls.checkbox[i].addListener("focusout", this.widgetEnabler, this);
			}
			
			for (var i in canvas_controls.widget) {
				canvas_controls.widget[i].set({singleStep: gridStep, enabled: false});
				canvas_controls.widget[i].addListener("click", this.applyMaps, this);
				canvas_controls.widget[i].addListener("changeValue", this.applyMaps, this);
				canvas_controls.widget[i].addListener("focusout", this.applyMaps, this);
			}
			
			layoutControls["qx.ui.layout.Canvas"] = canvas_controls;
			
            var dock_selectbox = new qx.ui.form.SelectBox();
            
            this.__dockArray = {
                "center" : new qx.ui.form.ListItem("center"), 
                "north" : new qx.ui.form.ListItem("north"),
                "east" : new qx.ui.form.ListItem("east"),
                "south" : new qx.ui.form.ListItem("south"),
                "west" : new qx.ui.form.ListItem("west")
            };
            
            for (var item in this.__dockArray) { dock_selectbox.add(this.__dockArray[item]); }
			
			var dock_controls = {
				checkbox: {
					edge: new qx.ui.form.CheckBox("Edge")
				},
				widget: {
					edge: dock_selectbox
				}
			};
			
			for (var i in dock_controls.checkbox) {
				dock_controls.checkbox[i].addListener("click", this.widgetEnabler, this);
				dock_controls.checkbox[i].addListener("changeValue", this.widgetEnabler, this);
				dock_controls.checkbox[i].addListener("focusout", this.widgetEnabler, this);
			}
			
			for (var i in dock_controls.widget) {
				dock_controls.widget[i].set({enabled: false});
				dock_controls.widget[i].addListener("click", this.applyMaps, this);
				dock_controls.widget[i].addListener("changeSelection", this.applyMaps, this);
				dock_controls.widget[i].addListener("focusout", this.applyMaps, this);
			}
			
			layoutControls["qx.ui.layout.Dock"] = dock_controls;
			
			var empty_controls = {
				checkbox: {},
				widget: {}
			};
			
			layoutControls["qx.ui.layout.HBox"] = empty_controls;
			layoutControls["qx.ui.layout.VBox"] = empty_controls;
			
			this.setLayoutControls(layoutControls);
			
			var common_controls = {
				checkbox: {
					height: new qx.ui.form.CheckBox("Height"),
					width: new qx.ui.form.CheckBox("Width"),
					zIndex: new qx.ui.form.CheckBox("zIndex")
				},
				widget: {
					height: new qx.ui.form.Spinner(0, null, 99999),
					width: new qx.ui.form.Spinner(0, null, 99999),
					zIndex: new qx.ui.form.Spinner(-99999, null, 99999)
				}
			};
			
			common_controls.widget.height.set({singleStep: gridStep, enabled: false});
			common_controls.widget.width.set({singleStep: gridStep, enabled: false});
			common_controls.widget.zIndex.set({enabled: false});
			
			for (var i in common_controls.checkbox) {
				common_controls.checkbox[i].addListener("changeValue", this.widgetEnabler, this);
				common_controls.checkbox[i].addListener("click", this.widgetEnabler, this);
				common_controls.checkbox[i].addListener("focusout", this.widgetEnabler, this);
			}
			
			for (var i in common_controls.widget) {
				common_controls.widget[i].addListener("click", this.applyMaps, this);
				common_controls.widget[i].addListener("changeValue", this.applyMaps, this);
				common_controls.widget[i].addListener("focusout", this.applyMaps, this);
			}
			
			this.setCommonControls(common_controls);
		},
		
		setMaps : function(layoutMap, height, width, zIndex)
		{
			this.setEnableUpdateEvents(false);
			
			var controls = this.getActiveControls();
			for (var i in controls.checkbox) {
				this.__mapWorker(layoutMap[i], controls.checkbox[i], controls.widget[i]);
			}
			
			this.__mapWorker(height, controls.checkbox["height"], controls.widget["height"]);
			this.__mapWorker(width, controls.checkbox["width"], controls.widget["width"]);
			this.__mapWorker(zIndex, controls.checkbox["zIndex"], controls.widget["zIndex"]);
			
			this.setEnableUpdateEvents(true);
		},
		
		__mapWorker : function(value, check, widget)
		{
			if (value != undefined) {
				check.setValue(true);
				widget.setEnabled(true);
				if (widget instanceof qx.ui.form.SelectBox) {
				    widget.setSelection([this.__dockArray[value]]);
				} else {
				    widget.setValue(value);
				}
			} else {
				check.setValue(false);
				widget.setValue(null);
				widget.setEnabled(false);
			}
		},
		
		updateSelection : function(object)
		{
			if (object != null && object.getLayoutParent() != null && typeof object.getLayoutParent().getLayout == "function") {
				this.enableControls(true);
				var old_controls = this.getActiveControls();
				
				var mode = object.getLayoutParent().getLayout().classname;
				this.debug('MODE INFO ==> '+ object +"//"+ object.getLayoutParent() +"//"+ mode);
				if (mode != this.getActiveLayoutMode()) {
					for (var i in old_controls.checkbox) {
						this.remove(old_controls.checkbox[i]);
						this.remove(old_controls.widget[i]);
					}

					this.setActiveLayoutControls(this.getLayoutControls()[mode]);
					var new_controls = new Object();
					new_controls.checkbox = blueprint.util.Misc.combineJson(this.getActiveLayoutControls().checkbox, this.getCommonControls().checkbox);
					new_controls.widget = blueprint.util.Misc.combineJson(this.getActiveLayoutControls().widget, this.getCommonControls().widget);
					this.setActiveControls(new_controls);

					var temp_top = 10;
					for (var i in new_controls.checkbox) {
						this.add(new_controls.checkbox[i], {top: temp_top, left: 10});
						this.add(new_controls.widget[i], {top: temp_top, left: 100});
						temp_top = temp_top + 30;
					}

					this.setActiveLayoutMode(mode);
				}
				
				this.setMaps(object.getLayoutProperties(), object.getHeight(), object.getWidth(), object.getZIndex());
			} else {
				this.enableControls(false);
			}
		},
		
		widgetEnabler : function()
		{
			if (this.getEnableUpdateEvents()) {
				var controls = this.getActiveControls();
				
				if (this.getActiveLayoutMode() == "qx.ui.layout.Canvas") {
					var vertical_position = (controls.checkbox["top"].getValue() || controls.checkbox["bottom"].getValue());
					var horizontal_position = (controls.checkbox["left"].getValue() || controls.checkbox["right"].getValue());

					if (!vertical_position) {
						this.__mapWorker(10, controls.checkbox["top"], controls.widget["top"]);
					}
					if (!horizontal_position) {
						this.__mapWorker(10, controls.checkbox["left"], controls.widget["left"]);
					}
				}
				
				if (this.getActiveLayoutMode() == "qx.ui.layout.Dock") {
					if (!controls.checkbox["edge"].getValue()) {
						this.__mapWorker("center", controls.checkbox["edge"], controls.widget["edge"]);
					}
				}
				
				for (var i in controls.checkbox) {
					this.__widgetWorker(controls.checkbox[i], controls.widget[i]);
				}

				this.applyMaps();
			}
		},
		
		__widgetWorker : function(check, widget)
		{
			//spin.oldValueTemp = spin.getValue();
			widget.setEnabled(check.getValue());
			if (check.getValue() == false) {
				widget.setValue(null);
			}
		},
		
		enableControls : function(value)
		{
			var controls = this.getActiveControls();
			for (var i in controls.checkbox) {
				controls.checkbox[i].setEnabled(value);
			}
		},
		
		applyMaps : function(e)
		{
			if (this.getEnableUpdateEvents()) {
				
				var controls = this.getActiveLayoutControls();
				var layoutMap = new Object();
				for (var i in controls.checkbox) {
					if (controls.checkbox[i].getValue()) {
					    if (controls.widget[i] instanceof qx.ui.form.SelectBox) {
					        layoutMap[i] = controls.widget[i].getSelection()[0].getLabel();
				        } else {
				            layoutMap[i] = controls.widget[i].getValue();
				        }
					} else {
						layoutMap[i] = null;
					}
				}

				var height = null;
				var width = null;
				
				var common_controls = this.getCommonControls();
				var common_settings = new Object();
				
				for (var i in common_controls.checkbox) {
					if (common_controls.checkbox[i].getValue()) {
						common_settings[i] = common_controls.widget[i].getValue();
					} else {
						common_settings[i] = null;
					}
				}

				this.getObjectTree().getSelectedObject().setLayoutProperties(layoutMap);
				this.getObjectTree().getSelectedObject().set(common_settings);
			}
		}
	},

	/*
	*****************************************************************************
	DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{

	}
});