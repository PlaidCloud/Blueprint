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
		this.base(arguments, new qx.ui.layout.HBox(4));
		this.__manager = qx.core.Init.getApplication().getManager();
		
		this.setDroppable(true);
		this.addListener("drop", this.__drop, this);
		
		if (genId != null) {
			var objId;
			
			this.add(new qx.ui.basic.Label(this.__manager.getObjectId(genId)));
			this.add(new qx.ui.basic.Label(this.__manager.getObjectClass(genId)));
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
		__manager : null,
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
			this.setDecorator("radiobutton-hovered");
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
