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
* A list of forms used in the blueprint document. You can click on a
* form to select it, and see the objects associated with it. You can
* drag objects onto a form to move them into that form.
*/
qx.Class.define("designer.ui.form.FormList", {
	extend: qx.ui.container.SlideBar,

	/** 
	* Constructs the form list.
	*/
	construct: function() {
		this.base(arguments);
		
		this.setOrientation("vertical");
		this.setLayout(new qx.ui.layout.VBox());
		
		this.refreshForms();
		
		qx.core.Init.getApplication().getManager().addListener("jsonLoaded", this.refreshForms, this);
	},

	properties: {
		/**
		* The currently selected FormListItem
		*/
		selection: {
			nullable: true,
			event: "changeSelection",
			apply: "_applySelection"
		},
		/**
		* The ObjectList paired with this FormList.
		*/
		objectList: {
			check: "designer.ui.form.ObjectList"
		}
	},

	members: {
		/**
		* Asks the manager for all of the forms, and displays them all.
		*/
		_unassigned: null,
		refreshForms: function(e) {
			this.removeAll();
			var formlist = qx.core.Init.getApplication().getManager().getForms();
			this._unassigned = new designer.ui.form.UnassignedFormItem(this);
			this.add(this._unassigned);
			if (formlist.length > 0) {
				for (var i=0; i<formlist.length; i++) {
					this.add(new designer.ui.form.FormItem(formlist[i], this));
				}
			} else {
				this.add(new qx.ui.basic.Label("No forms."));
			}
			this.setSelection(this._unassigned);
		},
		
		/**
		* Called when selection changes. Handles selection highlighting.
		*/
		_applySelection: function(value, old) {
			if (old) {
				old.unhighlight();
			}
			
			if (value) {
				value.highlight();
			}
			
			return value;
		}
	},

	destruct: function() {
	}
});
