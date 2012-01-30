qx.Mixin.define("designer.core.manager.MPalette", {
    members: {
        _nextdropid: 0,
        _requestIdToGeneratedId: null,
        newDropId: function() {
            return this._nextdropid++;
        },
        isDescendent: function(desId, ancId) {
            if (ancId == this.getRootObject()) {
                return true;
            } else {
                var head = desId; 
                while (head != this.getRootObject()) {
                    if (head == ancId) {
                        return true;
                    } else {
                        head = this.getParent(head);
                    }
                }
                return false;
            }
        },
        requestNewObject: function(clazz, parentId, requestId) {
            this.debug("new " + clazz + " requested on " + parentId + " with requestID " + requestId);
            if (this._requestIdToGeneratedId && this._requestIdToGeneratedId[requestId]) {
                var genId = this._requestIdToGeneratedId[requestId];
                this.debug("second request with id " + requestId + " object made is " + genId);
                if (this.isDescendent(parentId, this.getParent(genId))) {
                    this.debug("should be moving it to " + parentId);
                    this.adoptObject(genId, parentId);
                }
            } else {
                if (this.getClass(clazz).STUB) {
                    var stub = this.getClass(clazz).STUB;
                } else {
                    var stub = designer.util.Misc.simpleStub(clazz);
                }
                var genId = this.createLayoutObject(qx.lang.Json.parse(stub), parentId);
                this.debug("created " + genId);
                if (!this._requestIdToGeneratedId) {
                    this._requestIdToGeneratedId = [];
                }
                this._requestIdToGeneratedId[requestId] = genId;
                this.debug(this._requestIdToGeneratedId);
            }
        }
    }
});
