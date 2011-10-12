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

qx.Bootstrap.define("designer.util.Misc", {
	type: "static",

	statics: {
		tbd : function() {
			throw new Error("Why did you call me?");
		},
		simpleStub: function(classname) {
		    return('{\n\t"objectClass": "'+classname+'"\n}\n'); 
		},
		plaidAlert: function(vData) {
			if (qx.lang.Type.isString(vData)) {
				var text = vData;
				
				vData = {
					"caption": "Alert",
					"message": text
				};
			}
			
			qx.core.Init.getApplication().getDialogManager().display(vData);
		}
	}
});
