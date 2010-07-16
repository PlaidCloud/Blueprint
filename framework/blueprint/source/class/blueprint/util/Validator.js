/* ************************************************************************

Tartan Blueprint

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

qx.Class.define("blueprint.util.Validator", {
    extend : qx.core.Object,
    type : "singleton",

    construct : function()
    {
        this.__defs = blueprint.util.Schema.blueprint;
    },

    members :
    {
        importDefs : function(defs)
        {
            //TODO: Validator should validate new json schemas.
            this.__defs = blueprint.util.Misc.combineJson(this.__defs, defs);
        },
        
        check : function(json) {
            var def = this.getDef("top_container");
            
            return this._checkWorker(json, def);
        },
        
        _checkWorker : function(json, def, valid) {
            if (valid === undefined) { valid = true; }
            
            this.debug("_checkWorker(" + qx.util.Json.stringify(json, true) + " // " + qx.util.Json.stringify(def, true) + ")");
            for (var propName in def["properties"]) {
                var prop = def["properties"][propName];
                
                if (prop["nullable"] == false && json[propName] == null) {
                    this.warn("Non-nullable property \"" + propName + "\" on object is null.");
                }
                
                if (prop["type"] && json[propName] && qx.lang.Type.getClass(json[propName]) != prop["type"]) {
                    this.warn("Property \"" + propName + "\" (" + qx.lang.Type.getClass(json[propName]) + ") on object does not match (" + prop["type"] + ") check specification.");
                }
            }
            
            for (var item in json["contents"]) {
                
                this.warn(json["contents"][item]["object"]);
                valid = this._checkWorker(json["contents"][item]["object"], def, valid);
            }
            
            return valid;
        },
        
        getDef : function(requestDef) {
            if (this.__defs[requestDef] == undefined) {
                throw new Error("Definition \"" + requestDef + "\" not found!");
            }
            
            var def = this._getDefWorker(this.__defs[requestDef]);
            
            return def
        },
        
        _getDefWorker : function(def) {
            if (def["__build"] == true) { return def; }
            
            if (def["extend"] != undefined) {
                if (this.__defs[def["extend"]] != undefined) {
                    var parentDef = this._getDefWorker(this.__defs[def["extend"]]);
                    
                    for (var propName in parentDef["properties"]) {
                        if (def["properties"][propName] != undefined) {
                            if (def["properties"][propName]["refine"] != true) {
                                throw new Error("Error in schema! \"" + propName + "\" redefined, but refine key not set!");
                            }
                        } else {
                            def["properties"][propName] = parentDef["properties"][propName]
                        }
                    }
                } else {
                    throw new Error("Error in schema! \"" + def["extend"] + "\" referenced, but not found!");
                }
            }
            
            def["__build"] = true;
            return def;
        }
    }
});