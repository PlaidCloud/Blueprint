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

qx.Class.define("designer.ui.LayoutController",
{
	extend  : qx.ui.core.Widget,

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
		this.base(arguments);
		
        this.__manager = qx.core.Init.getApplication().getManager();
        
        this.set({
        	padding: [10,10,10,10]
        });
		
		this._setLayout(new qx.ui.layout.Grid(2,2));
		
		designer.core.manager.Selection.getInstance().addListener("changeSelection", this.__updateSelection, this);
		
		this.addListener("appear", function() {
			designer.core.manager.Selection.getInstance().getPopup().addListener("move", this.__updateSelection, this);
			designer.core.manager.Selection.getInstance().getPopup().addListener("resize", this.__updateSelection, this);
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
        __dockMap : null,
        __manager : null,
        __selectedId: null,
        __layoutControls: null,
        __common_controls: null,
        __active_controls: null,
        __mode: null,
        
		__initControls : function()
		{
			var gridStep = this.getGridStep();
			
			this.__layoutControls = {};
			
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
				canvas_controls.checkbox[i].addListener("changeValue", this.__widgetEnabler, this);
				canvas_controls.checkbox[i].addListener("click", this.__widgetEnabler, this);
				canvas_controls.checkbox[i].addListener("focusout", this.__widgetEnabler, this);
			}
			
			for (var i in canvas_controls.widget) {
				canvas_controls.widget[i].set({singleStep: gridStep, enabled: false});
				canvas_controls.widget[i].addListener("click", this.__applyMaps, this);
				canvas_controls.widget[i].addListener("changeValue", this.__applyMaps, this);
				canvas_controls.widget[i].addListener("focusout", this.__applyMaps, this);
			}
			
			this.__layoutControls["qx.ui.layout.Canvas"] = canvas_controls;
			
            var dock_selectbox = new qx.ui.form.SelectBox();
            
            this.__dockMap = {
                center : new qx.ui.form.ListItem("center"), 
                north : new qx.ui.form.ListItem("north"),
                east : new qx.ui.form.ListItem("east"),
                south : new qx.ui.form.ListItem("south"),
                west : new qx.ui.form.ListItem("west")
            };
            
            for (var item in this.__dockMap) { dock_selectbox.add(this.__dockMap[item]); }
			
			var dock_controls = {
				checkbox: {
					edge: new qx.ui.form.CheckBox("Edge")
				},
				widget: {
					edge: dock_selectbox
				}
			};
			
			for (var i in dock_controls.checkbox) {
				dock_controls.checkbox[i].addListener("click", this.__widgetEnabler, this);
				dock_controls.checkbox[i].addListener("changeValue", this.__widgetEnabler, this);
				dock_controls.checkbox[i].addListener("focusout", this.__widgetEnabler, this);
			}
			
			for (var i in dock_controls.widget) {
				dock_controls.widget[i].set({enabled: false});
				dock_controls.widget[i].addListener("click", this.__applyMaps, this);
				dock_controls.widget[i].addListener("changeSelection", this.__applyMaps, this);
				dock_controls.widget[i].addListener("focusout", this.__applyMaps, this);
			}
			
			this.__layoutControls["qx.ui.layout.Dock"] = dock_controls;
			
			var empty_controls = {
				checkbox: {},
				widget: {}
			};
			
			this.__layoutControls["qx.ui.layout.HBox"] = empty_controls;
			this.__layoutControls["qx.ui.layout.VBox"] = empty_controls;
			this.__layoutControls["__top_level"] = empty_controls;
			
			
			this.__common_controls = {
				checkbox: {
					height: new qx.ui.form.CheckBox("Height"),
					width: new qx.ui.form.CheckBox("Width")
				},
				widget: {
					height: new qx.ui.form.Spinner(0, null, 99999),
					width: new qx.ui.form.Spinner(0, null, 99999)
				}
			};
			
			this.__common_controls.widget.height.set({singleStep: gridStep, enabled: false});
			this.__common_controls.widget.width.set({singleStep: gridStep, enabled: false});
			
			for (var i in this.__common_controls.checkbox) {
				this.__common_controls.checkbox[i].addListener("changeValue", this.__widgetEnabler, this);
				this.__common_controls.checkbox[i].addListener("click", this.__widgetEnabler, this);
				this.__common_controls.checkbox[i].addListener("focusout", this.__widgetEnabler, this);
			}
			
			for (var i in this.__common_controls.widget) {
				this.__common_controls.widget[i].addListener("click", this.__applyMaps, this);
				this.__common_controls.widget[i].addListener("changeValue", this.__applyMaps, this);
				this.__common_controls.widget[i].addListener("focusout", this.__applyMaps, this);
			}
		},
		
		setMaps : function(layoutmap, height, width)
		{
			this.setEnableUpdateEvents(false);
			
			if (this.__active_controls) {
				for (var i in this.__active_controls.checkbox) {
					this.__mapWorker(layoutmap[i], this.__active_controls.checkbox[i], this.__active_controls.widget[i]);
				}
			}
			
			this.__mapWorker(height, this.__active_controls.checkbox["height"], this.__active_controls.widget["height"]);
			this.__mapWorker(width, this.__active_controls.checkbox["width"], this.__active_controls.widget["width"]);
			
			this.setEnableUpdateEvents(true);
		},
		
		__mapWorker : function(value, check, widget)
		{
			if (value != undefined) {
				check.setValue(true);
				widget.setEnabled(true);
				if (widget instanceof qx.ui.form.SelectBox) {
				    widget.setSelection([this.__dockMap[value]]);
				} else {
				    widget.setValue(value);
				}
			} else {
				check.setValue(false);
				widget.setValue(null);
				widget.setEnabled(false);
			}
		},
		
		__updateSelection : function()
		{
			var selectedId = this.__manager.getSelection();
			if (selectedId) {
				this.__selectedId = selectedId;
				var layoutmap, height, width;
				this.__mode = null;
				
				layoutmap = this.__manager.getLayoutProperties(selectedId);
				height = this.__manager.getProperty(selectedId, "height");
				width = this.__manager.getProperty(selectedId, "width");
				
				this.enableControls(true);
				
				var parentId = this.__manager.getParent(selectedId);
				
				if (this.__manager.getConstructorSetting(parentId, "innerLayout")) {
					this.__mode = this.__manager.getConstructorSetting(parentId, "innerLayout");
					
				} else if (this.__manager.getComponent(parentId, "layout")) {
					this.__mode = this.__manager.getObjectClass(this.__manager.getComponent(parentId, "layout"))
					
				} else {
					// Special cases
					if (this.__manager.getObjectClass(parentId) == "blueprint.ui.groupbox.GroupBox") {
						this.__mode = "qx.ui.layout.Canvas";
					} else if (this.__manager.getRootLayoutObject() == selectedId) {
						// This is a top level layout object. No layout controls for it.
						this.__mode = "__top_level";
					} else {
						this.warn(false, "All layout tests have failed for object: " + selectedId);
					}
				}
				
				this._removeAll();
				
				if (this.__mode) {
					var new_controls = {};
					
					new_controls.checkbox = blueprint.util.Misc.combineJson(this.__layoutControls[this.__mode].checkbox, this.__common_controls.checkbox);
					new_controls.widget = blueprint.util.Misc.combineJson(this.__layoutControls[this.__mode].widget, this.__common_controls.widget);
					this.__active_controls = new_controls;
					
					var r = 0;
					for (var i in new_controls.checkbox) {
						this._add(new_controls.checkbox[i], {row: r, column: 0});
						this._add(new_controls.widget[i], {row: r, column: 1});
						r++;
					}
				}
				
				this.setMaps(layoutmap, height, width);
			} else {
				this._removeAll();
			}
		},
		
		__widgetEnabler : function()
		{
			if (this.getEnableUpdateEvents()) {
				var controls = this.__active_controls;
				
				if (this.__mode == "qx.ui.layout.Canvas") {
					var vertical_position = (controls.checkbox["top"].getValue() || controls.checkbox["bottom"].getValue());
					var horizontal_position = (controls.checkbox["left"].getValue() || controls.checkbox["right"].getValue());

					if (!vertical_position) {
						this.__mapWorker(10, controls.checkbox["top"], controls.widget["top"]);
					}
					if (!horizontal_position) {
						this.__mapWorker(10, controls.checkbox["left"], controls.widget["left"]);
					}
				}
				
				if (this.__mode == "qx.ui.layout.Dock") {
					if (!controls.checkbox["edge"].getValue()) {
						this.__mapWorker("center", controls.checkbox["edge"], controls.widget["edge"]);
					}
				}
				
				for (var i in controls.checkbox) {
					this.__widgetWorker(controls.checkbox[i], controls.widget[i]);
				}

				this.__applyMaps();
			}
		},
		
		__widgetWorker : function(check, widget)
		{
			widget.setEnabled(check.getValue());
			if (check.getValue() == false) {
				widget.setValue(null);
			}
		},
		
		enableControls : function(value)
		{
			if (this.__active_controls) {
				for (var i in this.__active_controls.checkbox) {
					this.__active_controls.checkbox[i].setEnabled(value);
				}
			}
		},
		
		__applyMaps : function(e)
		{
			if (this.__selectedId && this.getEnableUpdateEvents()) {
				
				var controls = this.__active_controls;
				var layoutmap = new Object();
				for (var i in controls.checkbox) {
					if (controls.checkbox[i].getValue()) {
					    if (controls.widget[i] instanceof qx.ui.form.SelectBox) {
					        layoutmap[i] = controls.widget[i].getSelection()[0].getLabel();
				        } else {
				            layoutmap[i] = controls.widget[i].getValue();
				        }
					} else {
						// Do not include this value.
					}
				}

				var height = layoutmap.height; delete(layoutmap.height);
				var width = layoutmap.width; delete(layoutmap.width);
				
				this.__manager.setLayoutProperties(this.__selectedId, layoutmap);
				
				if (qx.lang.Type.isNumber(height)) {
					this.__manager.setProperty(this.__selectedId, "height", height);
				} else {
					this.__manager.setProperty(this.__selectedId, "height", null, true);
				}
				
				if (qx.lang.Type.isNumber(width)) {
					this.__manager.setProperty(this.__selectedId, "width", width);
				} else {
					this.__manager.setProperty(this.__selectedId, "width", null, true);
				}
				
				designer.core.manager.Selection.getInstance().getPopup().redraw();
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