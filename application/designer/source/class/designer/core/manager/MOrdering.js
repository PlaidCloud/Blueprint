qx.Mixin.define("designer.core.manager.MOrdering",
{
	members: {
		/* Removes object from it's parent, without doing anything else */
		orphanObject: function(generatedId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedID: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[this._objectMeta[generatedId].parentId], "parent: " + this._objectMeta[generatedId].parentId + " was not found!");

			this.debug(this._objectMeta[generatedId]);
			this.debug(this._objectMeta[generatedId].parentId);
			this.debug(this._objectMeta[this._objectMeta[generatedId].parentId]);
			this.debug(this._objectMeta[this._objectMeta[generatedId].parentId].components);

			//if (this._objectMeta[generatedId].parentId != this._rootGeneratedId) {
				qx.lang.Array.remove(this._objectMeta[this._objectMeta[generatedId].parentId].contents, generatedId);
			//} else {
			//	qx.lang.Array.remove(this._objectMeta[this._rootGeneratedId].data.complex, generatedId);
			//}

			this._objectMeta[generatedId].parentId = null;
		},

		/* Adds an object to a parent, at the end */
		adoptObject: function(generatedId, parentId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedID: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[parentId], "parentID: " + parentId + " was not found!");

			if (this._objectMeta[generatedId].parentId) {
				this.orphanObject(generatedId);
			}

			this._objectMeta[generatedId].parentId = parentId;

			this._objectMeta[parentId].contents.push(generatedId);
		},
		/* Adds an object to a parent, before another */
		insertObjectBefore: function(generatedId, referentId) {
			qx.core.Assert.assertObject(this._objects[generatedId], "generatedID: " + generatedId + " was not found!");
			qx.core.Assert.assertObject(this._objects[referentId], "referentID: " + referentId + " was not found!");

			if (this._objectMeta[generatedId].parentId) {
				this.orphanObject(generatedId);
			}

			this._objectMeta[generatedId].parentId = this._objectMeta[referentId].parentId;
			
			this.debug(this._objectMeta[generatedId]);
			this.debug(this._objectMeta[referentId]);


			qx.lang.Array.insertBefore(this._objectMeta[this._objectMeta[referentId].parentId].contents, generatedId, referentId);
		}

	}
});
