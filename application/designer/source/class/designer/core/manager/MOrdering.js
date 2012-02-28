qx.Mixin.define("designer.core.manager.MOrdering",
{
	members: {
		/* Removes object from it's parent, without doing anything else */
        getParent: function(generatedId) {
            return this._objectMeta[generatedId].parentId;
        },
		orphanObject: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[this._objectMeta[generatedId].parentId], "parent: " + this._objectMeta[generatedId].parentId + " was not found!");

			qx.lang.Array.remove(this._objectMeta[this._objectMeta[generatedId].parentId].contents, generatedId);

			this._objectMeta[generatedId].parentId = null;
			
			this.fireEvent("jsonLoaded");
		},

		/* Adds an object to a parent, at the end */
		adoptObject: function(generatedId, parentId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[parentId], "parentID: " + parentId + " was not found!");
			qx.core.Assert.assertNotEquals(generatedId, parentId, "generatedId: " + generatedId + " and parentID: " + parentId + " are the same!");

			if (this._objectMeta[generatedId].parentId) {
				this.orphanObject(generatedId);
			}

			this._objectMeta[generatedId].parentId = parentId;

			this._objectMeta[parentId].contents.push(generatedId);

			this.fireEvent("jsonLoaded");
		},

		/* Adds an object to a parent, before another */
		insertObjectBefore: function(generatedId, referentId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[referentId], "referentID: " + referentId + " was not found!");
			qx.core.Assert.assertNotEquals(generatedId, referentId, "generatedId: " + generatedId + " and referentID: " + referentId + " are the same!");

			if (this._objectMeta[generatedId].parentId) {
				this.orphanObject(generatedId);
			}

			this._objectMeta[generatedId].parentId = this._objectMeta[referentId].parentId;
			
			qx.lang.Array.insertBefore(this._objectMeta[this._objectMeta[referentId].parentId].contents, generatedId, referentId);

			this.fireEvent("jsonLoaded");
		},

		/* Adds an object to a parent, before another */
		insertObjectAfter: function(generatedId, referentId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedId: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[referentId], "referentID: " + referentId + " was not found!");
			qx.core.Assert.assertNotEquals(generatedId, referentId, "generatedId: " + generatedId + " and referentID: " + referentId + " are the same!");

			if (this._objectMeta[generatedId].parentId) {
				this.orphanObject(generatedId);
			}

			this._objectMeta[generatedId].parentId = this._objectMeta[referentId].parentId;
			
			qx.lang.Array.insertAfter(this._objectMeta[this._objectMeta[referentId].parentId].contents, generatedId, referentId);

			this.fireEvent("jsonLoaded");
		}
	}
});
