/* ************************************************************************

	 Copyright:

	 License:

	 Authors:

************************************************************************ */

/* ************************************************************************

#asset(mobile_showcase/css/styles.css)
#asset(qx/mobile/icon/android/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "mobile_showcase"
 */
qx.Class.define("mobile_showcase.Application",
{
	extend : qx.application.Mobile,



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
			if (qx.core.Environment.get("qx.debug"))
			{
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
			}

			/*
			-------------------------------------------------------------------------
				Below is your actual application code...
				Remove or edit the following code to create your application.
			-------------------------------------------------------------------------
			*/

			var json = {
				"constructorSettings": {},
				"controllers": [],
				"data": {},
				"events": [],
				"functions": {},
				"layout": {
					"constructorSettings": {
						"innerLayout": "qx.ui.mobile.layout.VBox" 
					},
					"contents": [
						{
							"layoutmap": {},
							"object": {
								"objectClass": "blueprint.ui.mobile.basic.Label",
								"objectId": "myLabel",
								"qxSettings": {
									"value": "Hello World"
								}
							} 
						} 
					],
					"objectClass": "blueprint.ui.mobile.container.Composite",
					"objectId": "",
					"qxSettings": {
						
					}
				},
				"objectClass": "blueprint.TopContainer",
				"objectId": "",
				"qxSettings": {}
			};
			
			var doc = this.getRoot();
			
			var obj = blueprint.Manager.getInstance().generate(json, null, "mobile", false).getLayoutObject();
			
			doc.add(obj);
		}
	}
});
