/* ************************************************************************

Tartan Blueprint

http://www.tartansolutions.com

Copyright:
2008 - 2012 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Dan Hummon

************************************************************************ */

qx.Class.define("blueprint.ui.toolbar.ToolBar", {
	extend: qx.ui.toolbar.ToolBar,

	include: [
	blueprint.MBlueprintManager],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct: function(vData, namespace, skipRecursion) {
		this.base(arguments);

		this.set(vData.qxSettings);
	},

	properties: {
		hBoxAlignX :
		{
			check : [ "left", "center", "right" ],
			nullable : true,
			apply : "_applyAlign"
		},

		hBoxAlignY :
		{
			check : [ "top", "middle", "bottom", "baseline" ],
			nullable : true,
			apply : "_applyAlign"
		}
	},

	members: {
		_applyAlign : function(value, old, name) {
			if (name == "hBoxAlignX") {
				this._getLayout().setAlignY(value);
			}
			if (name == "hBoxAlignY") {
				this._getLayout().setAlignY(value);
			}

		}
	}
});
