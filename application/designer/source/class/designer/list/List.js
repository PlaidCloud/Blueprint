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

qx.Class.define("designer.list.List",
{
	extend  : qx.ui.table.Table,

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
		var tableModel = new qx.ui.table.model.Simple();
		
		tableModel.setColumns(["key", "value", ""]);
		tableModel.setColumnEditable(0, false);
		tableModel.setColumnEditable(1, true);
		tableModel.setColumnEditable(2, false);
		
		this.base(arguments, tableModel);
		
		this.setColumnWidth(0, 98);
		this.setColumnWidth(1, 120);
		tableModel.setColumnEditable(2, false);
		
		this.setWidth(250);
		
		this.setColumnVisibilityButtonVisible(false);
		this.getTableColumnModel().setColumnVisible(2, false);
		
		this.addListener("dataEdited", function(e) {
			var key = this.getTableModel().getValue(0, e.getData().row);
			var type = this.getTableModel().getValue(2, e.getData().row);
			
			if (type == "Number") {
				var value = parseFloat(this.getTableModel().getValue(1, e.getData().row));
				if (isNaN(value)) {value = null;}
			}
			if (type == "Integer") {
				var value = parseInt(this.getTableModel().getValue(1, e.getData().row));
				if (isNaN(value)) {value = null;}
			}
			if (type == "String") {
				var value = new String(this.getTableModel().getValue(1, e.getData().row));
				if (value == 'null') {value = null;}
			}
			if (type == "Boolean") {
				var value = new Boolean(this.getTableModel().getValue(1, e.getData().row));
			}
			
			var map = new Object;
			map[key] = value;
			
			if (key == 'height' || key == 'width') {
				try {
					this.getObjectTree().getSelectedObject().set(map);
					this.getObjectTree().getSelectedObject().getTargetControl().set(map);
				} catch (err) {
					alert('(2) An error has occured: ' + err);
					this.getTableModel().setValue(1, e.getData().row, e.getData().oldValue);
					this.cancelEditing();
				}
			} else {
				try {
					this.getObjectTree().getSelectedObject().getTargetControl().set(map);
				} catch (err) {
					alert('(3) An error has occured: ' + err);
					this.getTableModel().setValue(1, e.getData().row, e.getData().oldValue);
					this.cancelEditing();
				}
			}
		}, this);
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
		}
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		updateSelection : function(object)
		{
			this.cancelEditing();
			var propData = new Array();
			
			var allowedTypes = ["Number", "Integer", "String", "Boolean"];
			var disallowedProperties = ["blueprintNamespace", "blueprintType", "blueprintType", "constructorSettings", "objectId", "appearance"];
			
			if (object != null) {
				var propTemp = qx.Class.getProperties(eval(object.getTargetControl().classname));
				for (var i=0;i<propTemp.length;i++) {
					var type = qx.Class.getPropertyDefinition(eval(object.getTargetControl().classname), propTemp[i]).check;
					if (qx.lang.Array.contains(allowedTypes, type) && !qx.lang.Array.contains(disallowedProperties, propTemp[i])) {
						propData.push([propTemp[i], new String(object.getTargetControl().get(propTemp[i])), type]);
					} else {
						//this.debug('skipping type ' + type);
					}
				}
			}
			
			this.getTableModel().setData(propData);
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