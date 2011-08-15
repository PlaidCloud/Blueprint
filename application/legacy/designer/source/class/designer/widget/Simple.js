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

qx.Class.define("designer.widget.Simple",
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
	construct : function(widget)
	{
		this.base(arguments);
		this._setLayout(new qx.ui.layout.Canvas());
		
		if (widget instanceof blueprint.ui.container.Composite || widget instanceof blueprint.ui.groupbox.GroupBox) {
			// This widget is a container widget.
			this.setWidgetPadding(0);
			
			this.setDroppable(true);
			
			this.addListener("drop", function(e) {
				this.getObjectTree().addTreeNode(this, e.getRelatedTarget().getControlItem(), e);
				e.stopPropagation();
			}, this);
		} else {
			// This is not a container widget.
			this.setInnerBox(new qx.ui.core.Widget());
			this.setWidgetPadding(0);
			
			widget.setZIndex(-1);
			//widget.setEnabled(false);
			
			this._add(this.getInnerBox(), {left: 3, top: 3, right: 3, bottom: 3});
			
			if (typeof widget.add == "function") {
				this.setDroppable(true);
				this.addListener("drop", function(e) {
					this.debug('firing drop on ' + widget);
					this.getObjectTree().addTreeNode(this, e.getRelatedTarget().getControlItem(), e);
					e.stopPropagation();
				}, this);
			}
		}
		
		this._add(widget, {left: this.getWidgetPadding(), top: this.getWidgetPadding(), right: this.getWidgetPadding(), bottom: this.getWidgetPadding()});
		this.setTargetControl(widget);
		
		if(widget.getWidth() != null) {
			this.setWidth(widget.getWidth());
		}
		if(widget.getHeight() != null) {
			this.setHeight(widget.getHeight());
		}
		
		this.addListener("click", function(e) {
			this.getObjectTree().select(this);
			e.stopPropagation();
		});
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
		
		targetControl :
		{
			check: "qx.ui.core.LayoutItem"
		},
		
		innerBox :
		{
			check: "qx.ui.core.Widget",
			init: null
		},
		
		myNode :
		{
			check: "Integer"
		},
		
		widgetPadding :
		{
			check: "Integer"
		}
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		add : function(child, options)
		{
			if (typeof this.getTargetControl().add == "function"){
				this.getTargetControl().add(child, options);
			} else {
				this.warn('this.add called on widget without .add function.');
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