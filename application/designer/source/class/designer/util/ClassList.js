qx.Class.define("designer.util.ClassList",
{
	extend : qx.core.Object,
	type : "singleton",
	
	members :
	{
		__list : null,
		__matches : null,
		
		query : function(prefix) {
			if (!this.__list) {
				this.__list = [];
			}
			
			this.__matches = [];
			
			for (var i=0;i<this.__list.length;i++) {
				if (this.__list[i].slice(0,prefix.length) == prefix) {
					this.__matches.push(this.__list[i]);
				}
			}
			
			if (this.__matches.length == 0) {
				this.__queryWorker(prefix.split('.'));
			}
			
			return this.__matches;
		},
		
		__queryWorker : function(pathArr, maxDepth, currentDepth) {
			if (!qx.lang.Type.isNumber(maxDepth)) { maxDepth = 6; }
			if (!qx.lang.Type.isNumber(currentDepth)) { currentDepth = 0; }
			if (currentDepth > maxDepth) { return; }
			
			var search = blueprint.util.Misc.getDeepKey(window, pathArr)
			
			if (qx.lang.Type.isString(search.classname)) {
				this.__list.push(search.classname);
				this.__matches.push(search.classname);
			} else {
				for (var i in search) {
					if (qx.lang.Type.isString(i) && i.slice(0,2) != '__' && i.slice(0,2) != '$$') {					
						var firstLetter = i.slice(0,1).match(/[A-Za-z]/);
						if (firstLetter !== null) {
							var pathArrSub = qx.lang.Array.clone(pathArr);
							pathArrSub.push(i);
							this.__queryWorker(pathArrSub, maxDepth, currentDepth + 1);
						}
					}
				}
			}
		}
	}
});