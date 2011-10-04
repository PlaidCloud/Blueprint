qx.Class.define("designer.core.manager.Abstract", {
	extend: qx.core.Object,
	include: [
	designer.core.manager.MIndexing,
	designer.core.manager.MForms
	],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/
	
	/**
	* The abstract manager constructor.
	*/

	construct: function() {
		this.base(arguments);
	},
	
	properties: {
		layoutPage: {
			check: "designer.ui.LayoutPage"
		}
	},

	events: {
	
	},

	statics: {
	
	},

	members: {
		/**
		* Method for getting the children of an object.
		* @param generatedId {String} The id of the target object.
		* @return {Array} A list of the generatedIds of any child objects.
		*/
		getObjectContents: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " does not exist in the manager!");
			if (this._objectMeta[generatedId].contents) {
				return qx.lang.Array.clone(this._objectMeta[generatedId].contents);
			} else {
				return [];
			}
		},
		
		/**
		* Method for getting an objectId from a generatedId
		*
		* @param generatedId {String} The id of the target object.
		* @return {String} The objectId of the requested object.
		*/
		
		getObjectId: function(generatedId) {
			if (this._objects[generatedId].objectId) {
				return this._objects[generatedId].objectId
			} else {
				return ""
			}
		},
		
		/**
		* Method for setting an objectId on a generatedId
		*
		* @param generatedId {String} The id of the target object.
		* @param objectId {String} The id of the target object.
		* @return {void}
		*/
		
		setObjectId: function(generatedId, requestedId) {
			qx.core.Assert.assertUndefined(this._objectIds[requestedId], "Requested objectId: " + requestedId + " already exists!");
			
            var validIds = requestedId.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            
            qx.core.Assert.assertArray(validIds, "requestedId was not a valid objectId! (No match found.)");
            qx.core.Assert.assert(validIds.length == 1, "requestedId was not a valid objectId! (Multiple matches found.)");
            qx.core.Assert.assert(validIds[0] == requestedId, "requestedId was not a valid objectId! (Invalid match.)");
            
            this._objects[generatedId].objectId = requestedId;
		}
	}
});
