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

qx.Class.define("designer.widget.Mutable",
{
	extend  : designer.widget.Simple,
	include :
	[
	qx.ui.core.MMovable,
	qx.ui.core.MResizable
	],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(widget, popupEdit)
	{
		this.base(arguments, widget);
		
		this.setResizable(false);
		
		this.addListener("mouseover", function(e) {
			this.setShadow("main");
		}, this);
		
		this.addListener("mouseout", function(e) {
			this.setShadow(null);
		}, this);
		
		this.addListenerOnce("appear", function(e) {
			if (typeof this.getLayoutParent().getLayout == "function") {
				var layout = this.getLayoutParent().getLayout().classname;
			} else {
				var layout = "";
			}
			
			if (layout == "qx.ui.layout.Canvas") {
				if (this.getTargetControl() instanceof blueprint.ui.container.Composite || this.getTargetControl() instanceof blueprint.ui.groupbox.GroupBox) {
					// This widget is a container widget.
					this._activateMoveHandle(this);
					widget.setContextMenu(this.getContextMenu());
					
					widget.addListener("contextmenu", function(e) { e.stopPropagation(); });
				} else {
					// This is not a container widget.
					this._activateMoveHandle(this.getInnerBox());
					this.getInnerBox().setContextMenu(this.getContextMenu());
					
					this.getInnerBox().addListener("contextmenu", function(e) { e.stopPropagation(); });
				}
				
				this.setResizable(true);
				
				this.addListener("resize", function(e) {
					var new_width = Math.round(this.getWidth()/10) * 10;
					var new_height = Math.round(this.getHeight()/10) * 10;

					this.setWidth(new_width);
					this.setHeight(new_height);
					this.getTargetControl().setWidth(new_width - (this.getWidgetPadding() * 2));
					this.getTargetControl().setHeight(new_height - (this.getWidgetPadding() * 2));
				}, this);

				this.addListener("move", function(e) {
					if (this.getLayoutParent().getLayout() instanceof qx.ui.layout.Canvas) {
						var layout = this.getLayoutProperties();
						var new_layout = new Object();
						for (var i in layout) {
							new_layout[i] = Math.round(layout[i]/10) * 10;
						}

						this.setLayoutProperties(new_layout);
					}
				}, this);
			}
		}, this);
		
		if (popupEdit) {
		    this.debug('popupeditor enabled');
		    var popup = new qx.ui.popup.Popup(new qx.ui.layout.Canvas()).set({
              backgroundColor: "#ABCDEF",
              padding: [2, 2]
            });

            var textField = new qx.ui.form.TextField();
            textField.setAllowGrowX(true);

            textField.addListener("keypress", function(e) {
                if (e.getKeyIdentifier() == "Enter") {
                    popup.hide();
                    widget.set(popupEdit, textField.getValue());
                }
            }, widget);
            
            popup.add(textField);
            
            this.addListener("dblclick", function(e) {this.debug("ASFKJHASKFJHASFKJHASD");
                textField.setValue(widget.get(popupEdit));
                popup.placeToWidget(widget);
                popup.show();
                e.stopPropagation();
            });

            textField.addListener("appear", function(e) { textField.selectAllText(); textField.setWidth(widget.getSizeHint().width + 60); }, widget);
		}
	},
	
	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		getContextMenu : function()
		{
			var menu = new qx.ui.menu.Menu;

			var cmd_one = new qx.ui.menu.Button("Option 1");
			var cmd_two = new qx.ui.menu.Button("Option 2");
			var removeSelf = new qx.ui.menu.Button("Remove " + this.getTargetControl().classname);

			cmd_one.addListener("execute", function(e) {
				this.__addConnectorWindow();
			}, this);

			cmd_two.addListener("execute", function(e) {
				this.__removeConnectorWindow();
			}, this);

			removeSelf.addListener("execute", function(e) {
				this.__removeSelf();
			}, this);
			
			menu.add(cmd_one);
			menu.add(cmd_two);
			menu.add(removeSelf);

			return menu;
		},

		__removeSelf : function()
		{
			qx.event.Timer.once(function(e) {
				this.getObjectTree().removeTreeNode(this);
			}, this, 100);
		},

		__removeConnectorWindow : function()
		{

		},
		
		__addConnectorWindow : function()
		{

		},
		
		__getAddConnectorList : function()
		{

		},
		
		__getRemoveConnectorList : function()
		{
			
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