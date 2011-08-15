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

/**
* This is the main application class of your custom application "designer"
*/
qx.Class.define("designer.Application",
{
	extend : qx.application.Standalone,

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		/**
		* This method contains the initial application code and gets called 
		* during startup of the application
		*/
		main : function()
		{
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if ((qx.core.Environment.get("qx.debug")))
			{
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
			}
			
			// ***********************
			// Application Starts Here
			// ***********************
			
			// Document is the application root
			var doc = this.getRoot();
			var root = new qx.ui.container.Composite(new qx.ui.layout.Dock());
			

			//build nested split panes:
			var splitPane1 = new qx.ui.splitpane.Pane("horizontal");
			splitPane1.setDecorator("main");
			
			var splitPane2 = new qx.ui.splitpane.Pane("horizontal");
			splitPane2.setDecorator(null);	
			
			//Layout Design:
			//|       |                           |       |
			//|   A   |             B             |   C   |
			//|       |                           |       |
			
			//instantiate target containers:
			var targetA = new qx.ui.container.Composite(new qx.ui.layout.Grow());
			var targetB = new qx.ui.container.Composite(new qx.ui.layout.Grow());
			var targetC = new qx.ui.container.Composite(new qx.ui.layout.Grow());
			
			//instantiate panes
			var objectsPane = new qx.ui.splitpane.Pane("vertical");
			var layoutPane = new qx.ui.splitpane.Pane("vertical");
			var securityPane = new qx.ui.splitpane.Pane("vertical");


			//build low-level individual components
			var control_list = new designer.list.Control();
			var property_controller = new designer.list.List();
			var property_label = new qx.ui.basic.Label(" Properties:");
			var control_label = new qx.ui.basic.Label(" Controls:");
			
			var layout_label = new qx.ui.basic.Label(" Layout Properties:");
			var tabview = new designer.TabView();
			//var form_container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
			var layout_controller = new designer.controller.Layout();
			
			var tree = new designer.tree.Tree(property_label, property_controller, layout_label, layout_controller, tabview, targetC, layoutPane, securityPane);
			var form_security_controller = new designer.controller.FormSecurity(tree);
			tree.setFormSecurityController(form_security_controller);
			
			var comp_security_controller = new designer.controller.ComponentSecurity(tree);
			tree.setComponentSecurityController(comp_security_controller);
			
			var toolbar = new designer.toolbar.ToolBar(tree);
		
			//assemble layout:
			splitPane1.add(targetA, 1);
			splitPane1.add(splitPane2, 6);
			splitPane2.add(targetB, 5);
			splitPane2.add(targetC, 1);

			//build objects pane
			objectsPane.setDecorator(null);
				var northWest = new qx.ui.container.Composite(new qx.ui.layout.Dock());
				northWest.add(control_label, {edge: "north"});
			    northWest.add(control_list, {edge: "center"});
			objectsPane.add(northWest, 1);
			objectsPane.add(tree, 1);
			
			//build body pane
			//Placeholder.  Nothing to do here.  Just add form_container to appropriate target (targetB) later

			//build layout controller pane
			layoutPane.setDecorator(null);
			var northEast = new qx.ui.container.Composite(new qx.ui.layout.Dock());
			northEast.add(property_label, {edge: "north"});
			northEast.add(property_controller, {edge: "center"});
			layoutPane.add(northEast, 1);
			layoutPane.add(layout_controller, 1);

			//build security controller pane
			securityPane.setDecorator(null);
			securityPane.add(form_security_controller, 1);
			securityPane.add(comp_security_controller, 1);
			
			//add panes to targets
			targetA.add(objectsPane);
			targetB.add(tabview);
			targetC.add(layoutPane);
			
			//add root to document
			root.add(toolbar, {edge: "north"});
			root.add(splitPane1, {edge: "center"});
			doc.add(root, {left: 2, top: 2, right: 2, bottom: 2});			
		}
	}
});
