/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* Adams Tower
*/


/**
* An item that goes in a FormList.
*/
qx.Class.define("designer.ui.form.FormItem", {
	extend: qx.ui.container.Composite,

	/**
	* Constructs the FormItem.
	* @param genId The generated ID of the form being represented.
	* @param list The FormList that this FormItem is used in.
	*/
	construct: function(genId, list) {
		this.base(arguments, new qx.ui.layout.HBox());
		
		this.setDroppable(true);
		this.addListener("drop", this.__drop, this);
		
		if (genId != null) {
			var genIdLabel = new qx.ui.basic.Label(genId);
			genIdLabel.setWidth(50);
			this.add(genIdLabel);
			
			var objId;
			
			if (objId = qx.core.Init.getApplication().getManager().getObjectId(genId)) {
				var objIdLabel = new qx.ui.basic.Label(objId);
				objIdLabel.setWidth(100);
				this.add(objIdLabel);
			} else {
				this.add(new qx.ui.core.Spacer(100));
			}
			
			var objClass;
			
			if (objClass = qx.core.Init.getApplication().getManager().getObjectClass(genId)) {
				var objClassLabel = new qx.ui.basic.Label(objClass);
				objClassLabel.setWidth(200);
				this.add(objClassLabel);
			} else {
				this.add(new qx.ui.core.Spacer(200));
			}
		}
		
		this.setGeneratedId(genId);
		
		this._list = list;
		
		this.addListener("click", this.__onClick, this);
	},

	properties: {
		/**
		* The generated ID of the represented form.
		*/
		generatedId: {
			check: String,
			nullable: true
		}
	},

	members: {
		_list: null,
		/**
		* Called when the FormItem is clicked. Selects it.
		*/
		__onClick: function(e) {
			this._list.setSelection(this);
		},
		
		/**
		* Called when an object is dropped on the Form. Asks the
		* manager to move the object to the form.
		*/
		__drop: function(e) {
			var genId = e.getData("designer/object");
			qx.core.Init.getApplication().getManager().moveFormObject(genId, this.getGeneratedId());
			this._list.getObjectList().refreshObjects();
		},
		
		/**
		* Highlights this FormItem.
		*/
		highlight: function() {
			this.setDecorator("selected");
		},
		
		/**
		* Unhighlights this FormItem.
		*/
		unhighlight: function() {
			this.setDecorator(null);
		}
	},

	destruct: function() {
	}
});
