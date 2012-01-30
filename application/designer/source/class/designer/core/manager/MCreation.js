qx.Mixin.define("designer.core.manager.MCreation",
{
	events : {
		/**
		* Fired when some element in the layout json has changed. The passed data is
		* the generatedId of the changed object.
		*/
		layoutUpdate: "qx.event.type.Data"
	},
	
  	members : {
		/**
		* Function to provide a possible target in a layout.
		*
		* @param qxObject {qx.ui.core.LayoutItem} The LayoutItem parent being queried.
		* @return {Object || null} A possible layout map for the parent.
		*/

		_getPossibleLayoutMap : function(qxObject) {
			qx.core.Assert.assertFunction(qxObject.getLayout, "Specified qxObject: " + qxObject + " does not support the getLayout method.");
			
			var layout, layoutname;
			
			if (qx.lang.Type.isFunction(qxObject.getInnerLayout)) {
				layoutname = qxObject.getInnerLayout().classname;
			} else {
				layoutname = qxObject.getLayout().classname;
			}
			
			switch(layoutname) {
				case "qx.ui.layout.Canvas":
				layout = {
					top: 5,
					left: 5
				};
				break;
				
				case "qx.ui.layout.Dock":
				var targets = ["center", "north", "east", "south", "west"];
				var children = qxObject.getChildren();
				for (var i=0;i<children.length;i++) {
					qx.lang.Array.remove(targets, children[i].getLayoutProperties().edge);
				}
				qx.core.Assert.assert(targets.length > 0, "All possible targets used for this canvas layout!");
				
				layout = {
					edge: targets[0]
				};
				break;
				
				default:
				this.warn("No layout found!");
				break;
			}
			
			return layout;
			
		},
		
		/**
		* Worker function to create a new data object.
		*
		* @param obj {blueprint.data.Form} The new object.
		* @param parentId {String} The generatedId for the parent.
		* @return {void}
		*/
		
		createDataObject: function(obj, parentId) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			// Do something here?
		},

		/**
		* Function to create a new layout object.
		*
		* @param layoutObject {blueprint.data.Form} The new object.
		* @param parentId {String} The generatedId for the parent.
		* @param layoutmap {Object} The layout map for the new object (if necessary.)
		* @return {void}
		*/
		
		createLayoutObject: function(layoutObject, parentId, layoutmap) {
			qx.core.Assert.assertObject(this._objects[parentId], "parentId: " + parentId + " was not found!");
			
			var parent = this._objectMeta[parentId].qxTarget;
			
			if (parent instanceof qx.ui.tabview.TabView) {
				// TODO: This could be more elegant.
				var pageId;
				for (var i=0;i<this._objectMeta[parentId].contents.length;i++) {
					if (this._objectMeta[this._objectMeta[parentId].contents[i]].qxTarget === parent.getSelection()[0]) {
						pageId = this._objectMeta[parentId].contents[i];
					}
				}
				qx.core.Assert.assertString(pageId, "For some reason, couldn't find the selected page.");
				parentId = pageId;
				parent = this._objectMeta[pageId].qxTarget;
			}
			
			if (parentId == this._objectMeta[this._rootGeneratedId].layout) {
				
			}
			
			qx.core.Assert.assertFunction(parent.add, "Specified parent: " + parent + " does not support an add method.");
			
			if (!layoutmap) {
				layoutmap = this._getPossibleLayoutMap(parent);
			}
			
			var generatedId = this._importLayout(layoutObject, layoutmap, parentId);
			
			this._objectMeta[parentId].contents.push(generatedId);
			
			designer.core.manager.Selection.getInstance().clearSelection();
			
			this._renderLayout();
			
			this.fireEvent("layoutUpdate");
			this.fireEvent("jsonLoaded");
			
			this.debug("New object was: " + generatedId);
			
			this._objectMeta[generatedId].qxTarget.addListenerOnce("appear", function() {
				this.setSelection(generatedId);
			}, this);

            return generatedId;
		},
		
		deleteComponentObject : function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[this._objectMeta[generatedId].parentId], "parent: " + this._objectMeta[generatedId].parentId + " was not found!");
			
			if (this._objectMeta[generatedId].parentId != this._rootGeneratedId) {
				qx.lang.Array.remove(this._objectMeta[this._objectMeta[generatedId].parentId].components, generatedId);
			} else {
				qx.lang.Array.remove(this._objectMeta[this._rootGeneratedId].data.complex, generatedId);
			}
			
			this.deleteObjectCleanup(generatedId);
		},
		
		deleteObjectCleanup : function(generatedId) {
			if (this._objects[generatedId].objectId) {
				delete(this._objectIds[this._objects[generatedId].objectId]);
			}
			delete(this._objects[generatedId]);
			delete(this._objectMeta[generatedId]);
		},
		
		deleteLayoutObject: function(generatedId, preventRefresh) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[this._objectMeta[generatedId].parentId], "parent: " + this._objectMeta[generatedId].parentId + " was not found!");
			qx.core.Assert.assert(this._objectMeta[generatedId].parentId != this._rootGeneratedId, "Deleting the top level layout object is not yet supported!");
			var parentId = this._objectMeta[generatedId].parentId;
			
			for (var i=0;i<this._objectMeta[generatedId].contents.length;i++) {
				this.deleteLayoutObject(this._objectMeta[generatedId].contents[i], true);
			}
			
			for (var o in this._objectMeta[generatedId].components) {
				this.deleteComponentObject(this._objectMeta[generatedId].components[o]);
			}
			
			qx.lang.Array.remove(this._objectMeta[parentId].contents, generatedId);
			
			this.deleteObjectCleanup(generatedId);
			
			if (!preventRefresh) {
				this._renderLayout();
				this.fireEvent("layoutUpdate");
				this.fireEvent("jsonLoaded");
			}
		}
	}
});


























