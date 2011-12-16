/* ************************************************************************

Plaid Application Toolkit

http://www.tartansolutions.com

Copyright:
2008 Tartan Solutions, Inc

License:
GPL: http://www.gnu.org/licenses/gpl.html
or
Commercial - Visit www.tartansolutions.com for details on obtaining a valid license
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

/* ************************************************************************

************************************************************************ */

/**
* This widget represents an image.
*
* @appearance image
*/
qx.Class.define("designer.ui.Dialog", {
	extend: qx.ui.window.Window,

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* The constructor for the Dialog class.
	*/
	construct: function(options) {
		this.base(arguments);

		var defaultSettings = {
			caption: "Information",
			message: "&lt;information message&gt;",
			button1message: "Dismiss",
			button1function: null,
			button2message: null,
			button2function: null,
			icon: "icon/22/status/dialog-information.png",
			largeIcon: "icon/32/status/dialog-information.png",
			width: 400,
			height: 0,
			resizable: false,
			showMaximize: false,
			showMinimize: false,
			showClose: false
		};

		var options = qx.lang.Object.carefullyMergeWith(options, defaultSettings);

		options["modal"] = true;

		this.__baseCaption = options["caption"];

		this.set(options);

		this.setLayout(new qx.ui.layout.Dock(2, 2));

		var buttonBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
		buttonBar.getLayout().set({
			alignX: "right",
			reversed: true
		});
		var button1 = new qx.ui.form.Button(options["button1message"], "plaid/16/silk/cross.png");

		buttonBar.add(button1);
		
		if (options["button2message"]) {
			var button2 = new qx.ui.form.Button(options["button2message"], "plaid/16/silk/cross.png");
			buttonBar.add(button2);
		}

		var largeIcon = new qx.ui.basic.Image();
		this.bind("largeIcon", largeIcon, "source");

		largeIcon.set({
			padding: [2, 2, 2, 2]
		});

		var messageArea = new qx.ui.basic.Label();
		this.bind("message", messageArea, "value");

		messageArea.set({
			width: 330,
			rich: true,
			selectable: true
		});

		var scrollArea = new qx.ui.container.Scroll().set({
			allowGrowX: false,
			allowGrowY: true,
			allowShrinkY: false,
			padding: [5, 5, 15, 5],
			width: 330,
			height: 150
		});
		scrollArea.add(messageArea);

		this.add(scrollArea, {
			edge: "center"
		});
		this.add(largeIcon, {
			edge: "west"
		});
		this.add(buttonBar, {
			edge: "south"
		});
		if (options["button1function"]) {
			button1.addListener("execute", options["button1function"], this);
		} else {
			button1.addListener("execute",
			function(e) {
				this.close();
			},
			this);
		}
		
		if (options["button2function"]) {
			button2.addListener("execute", options["button2function"], this);
		}

		this.addListener("appear",
		function(e) {
			if (messageArea.getSizeHint().height < 300) {
				scrollArea.setHeight(messageArea.getSizeHint().height + 30);
			} else {
				scrollArea.setHeight(330);
			}

			this.center();
			this.focus();
		});

		this.addListener("changeQueueNumber",
		function(e) {
			var num = e.getData();
			if (num > 1) {
				this.setCaption(this.__baseCaption + " (" + num + ")");
			} else {
				this.setCaption(this.__baseCaption);
			}
		});

		/*button1.addListener("execute",
		function(e) {
			this.close();
		},
		this);*/

		this.addListener("close",
		function(e) {
			this.getDialogManager().dismiss();
		});
	},

	events: {
		"changeMessage": "qx.event.type.Data",
		"changeQueueNumber": "qx.event.type.Data",
		"changeLargeIcon": "qx.event.type.Data"
	},

	properties: {
		dialogManager: {
			check: "designer.core.manager.Dialog"
		},
		
		button1message: {
			check: "String",
			init: "",
			nullable: true
		},
		
		button1function: {
			check: "Function",
			init: null,
			nullable: true
		},
		
		button2message: {
			check: "String",
			init: "",
			nullable: true
		},
		
		button2function: {
			check: "Function",
			init: null,
			nullable: true
		},

		message: {
			check: "String",
			init: "",
			event: "changeMessage"
		},

		largeIcon: {
			check: "String",
			init: "",
			event: "changeLargeIcon"
		},

		queueNumber: {
			check: "Number",
			init: 0,
			event: "changeQueueNumber"
		}
	},

	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members: {
		__baseCaption: null
	}
});
