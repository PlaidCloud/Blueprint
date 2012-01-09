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

/* **********************************************

#ignore(jsonlint)
#ignore(JSV)

********************************************** */

/** TODOC
*/
qx.Bootstrap.define("designer.util.JsonError", {
	type: "static",
	
	statics: {
		//TODO: won't work if curly braces are in property names
		findLineById: function(jsonLines, id) {
			if (id.slice(0, 5) == "uuid:") {
				return [0, 0];
			} else {
				for (var i=0; i<jsonLines.length; i++) {
					var s = jsonLines[i].search("\"id\"\\s*:\\s*\""+id+"\"")
					if (s != -1) {
						var idChar = s;
						var idLine = i;
						break;
					}
				}
				if (idLine === undefined) {
					//oshit, never found this id!
					throw "Id not found!"
				}
				//go back to beginning of containing object
				var braceDepth = 0;
				for (var i=idLine; i>= 0; i--) {
					if (i == idLine) {
						for (var j=idChar; j>= 0; j--) {
							if (jsonLines[i][j] == '}') {
								braceDepth += 1;
							} else if (jsonLines[i][j] == '{') {
								if (braceDepth <= 0) {
									return i;
								} else {
									braceDepth -= 1;
								}
							}
						}
					} else {
						for (var j=jsonLines[i].length-1; j>= 0; j--) {
							if (jsonLines[i][j] == '}') {
								braceDepth += 1;
							} else if (jsonLines[i][j] == '{') {
								if (braceDepth <= 0) {
									return [i, j];
								} else {
									braceDepth -= 1;
								}
							}
						}
					}
				}
				//if we get here, we didn't find what we were looking for
				//maybe throw error?
				return [0, 0];
			}
		},
		
		getObjectByUrn: function(json, urn) {
			if (urn.slice(0, 4) != "urn:") {
				throw "urn doesn't have prefix \"urn:\"!";
			}
			
			var minusPrefix = urn.slice(4);
			var startId = minusPrefix.split("#")[0];
			var pathString = minusPrefix.split("#")[1];
			
			var startJson = designer.util.JsonError.getObjectById(json, startId);
			
			var path = pathString.split("/");
			
			return designer.util.JsonError.getObjectByPath(startJson, path.slice(1));
		},
		
		getObjectById: function(json, id) {
			return designer.util.JsonError.getObjectByPath(json, designer.util.JsonError.getPathById(json, id));
		},
		
		getObjectByPath: function(json, path) {
			if (path.length == 0) {
				return json;
			} else {
				return (designer.util.JsonError.getObjectByPath(json[path[0]], path.slice(1)));
			}
		},
		
		/* Returns true if the json has this id at the top level.
		 * Returns false if the id is not found in the json.
		 * Returns the path to the object having this id if that object is within.
		 */
		getPathById: function(json, id) {
			if (id.slice(0, 5) == "uuid:") {
				return [];
			}
			if (qx.lang.Type.isArray(json)) {
				for (var i=0; i < json.length; i++) {
					var r = designer.util.JsonError.getPathById(json[i], id);
					if (r === []) {
						return [i];
					} else if (r === false) {
						continue;
					} else {
						return [i].concat(r);
					}
				}
				//if we get here
				return false;
			} else if (qx.lang.Type.isObject(json)) {
				if (json["id"] == id) {
					return [];
				} else {
					for (var i in json) {
						var r = designer.util.JsonError.getPathById(json[i], id);
						if (r === []) {
							return [i];
						} else if (r === false) {
							continue
						} else {
							return [i].concat(r);
						}
					}
					//if we get here
					return false;
				}
			} else {
				return false;
			}
		},
		
		validate: function(jsontext, schematext) {
			if (!schematext) {
				schematext = designer.util.Schema.getInstance().getSchematext();
			}
			var json = jsonlint.parse(jsontext);
			var schema = jsonlint.parse(schematext);
			var env = JSV.createEnvironment();
			var report = env.validate(json, schema);
			
			if (report.errors.length !== 0) {
				throw report.errors[0];
			}
			
			var results = designer.util.JsonError.validateObjectIds(json);
			for (var id in results[1]) {
				if (results[1][id] != undefined) {
					throw {
						"message": "Undeclared objectId",
						"id": id,
						"path": results[1][id]["path"]
					}
				}
			}
			//jsonlint has a double escaping bug, so using qx.lang.Json.parse for actually returning.
			//return json;
			return qx.lang.Json.parse(jsontext);
		},
		
		findLineByPath: function(jsonLines, path, headLine, headChar) {
			if (headLine === undefined) {
				headLine = 0;
			}
			if (headChar === undefined) {
				headChar = 0;
			}
			
			if (path == "" || path === null || path === undefined || path.length == 0) {
				return [headLine, headChar];
			}
			
			//TODO: won't work for curly braces or brackets in property names
			//FIXED: also won't work for deeper property names appearing before identical shallower property names
			var depth=0;
			
			if (jsonLines[headLine][headChar] == '{') {
				for (var i=headLine; i<jsonLines.length; i++) {
					if (i==headLine) {
						var s=jsonLines[i].slice(headChar+1).search("\""+path[0]+"\"\\s*:");
						if (s!= -1) {
							var leftdown = jsonLines[i].slice(headChar+1, s).match(/[{\[]/);
							var leftup = jsonLines[i].slice(headChar+1, s).match(/[}\]]/);
							if (depth + leftdown - leftup > 0) {
								s = -1;
							} else {
								s += headChar+1;
							}
						}
					} else {
						var s=jsonLines[i].search("\""+path[0]+"\"\\s*:");
						if (s!= -1) {
							var leftdown = jsonLines[i].slice(0, s).match(/[{\[]/);
							var leftup = jsonLines[i].slice(0, s).match(/[}\]]/);
							if (depth + leftdown - leftup > 0) {
								s = -1;
							}
						}
					}
					
					//TODO: only works if '"property":{' is all on one line
					if (s != -1) {
						for (var j=s; j<jsonLines[i].length; j++) {
							if (jsonLines[i][j] == '{' || jsonLines[i][j] == '[') {
								if (path.length == 1) {
									return [i, j];
								} else {
									return designer.util.JsonError.findLineByPath(jsonLines, path.slice(1), i, j);
								}
							}
						}
					} else {
						if (i==headLine) {
							var down = jsonLines[i].slice(headChar+1).match(/[{\[]/);
							var up = jsonLines[i].slice(headChar+1).match(/[}\]]/);
							if (down != null) {
								depth += down.length;
							}
							if (up != null) {
								depth -= up.length;
							}
						} else {
							var down = jsonLines[i].match(/[{\[]/);
							var up = jsonLines[i].match(/[}\]]/);
							if (down != null) {
								depth += down.length;
							}
							if (up != null) {
								depth -= up.length;
							}
						}
					}
				}
			} else if (jsonLines[headLine][headChar] == '[') {
				//FIXED: doesn't work if there are deeper arrays or objects
				var pathCount = parseInt(path[0]);
				var commaCount = 0;
				var depth = 0;
				for (var i=headLine; i<jsonLines.length; i++) {
					for (var j=((i==headLine)?headChar+1:0); j<jsonLines[i].length; j++) {
						if (jsonLines[i][j] == ']' && depth == 0) {
							throw ("nothing at that path");
						}
						if (commaCount == pathCount) {
							if (jsonLines[i][j] == '{' || jsonLines[i][j] == '[') {
								if (path.length == 1) {
									return [i, j];
								} else {
									return designer.util.JsonError.findLineByPath(jsonLines, path.slice(1), i, j);
								}
							}
						} else {
							if (jsonLines[i][j] == '{' || jsonLines[i][j] == '[') {
								depth += 1;
							} else if (jsonLines[i][j] == '}' || jsonLines[i][j] == ']') {
								depth -= 1;
							} else if (jsonLines[i][j] == ',' && depth == 0) {
								commaCount += 1;
							}
						}
					}
				}
			} else {
				throw ("Head isn't at the beginning of an object or array.");
			}
			
			throw ("nothing at that path.");
		},
		
		findLineByUrn: function(jsonLines, urn) {
			if (urn.slice(0, 4) != "urn:") {
				throw "urn doesn't have prefix \"urn:\"!";
			}
			
			var minusPrefix = urn.slice(4);
			var startId = minusPrefix.split("#")[0];
			var pathString = minusPrefix.split("#")[1];
			
			var startCoords = designer.util.JsonError.findLineById(jsonLines, startId);
			var startLine = startCoords[0];
			var startChar = startCoords[1];
			
			var path = pathString.split("/");
			
			return designer.util.JsonError.findLineByPath(jsonLines, path.slice(1), startLine, startChar);
		},
		
		findLineOfProperty: function(jsonLines, propertyName, headLine, headChar) {
			//FIXED: doesn't work if a deeper property comes before an identical shallower property
			
			var depth = 0;
			
			for (var i=headLine; i<jsonLines.length; i++) {
				if (i==headLine) {
					var s=jsonLines[i].slice(headChar+1).search("\""+propertyName+"\"\\s*:");
					if (s != -1) {
						var leftdown = jsonLines[i].slice(headChar+1, s).match(/[{\[]/);
						var leftup = jsonLines[i].slice(headChar+1, s).match(/[}\]]/);
						if (depth + leftdown - leftup > 0) {
							s = -1;
						} else {
							s += headChar+1;
						}
					}
				} else {
					var s=jsonLines[i].search("\""+propertyName+"\"\\s*:");
					if (s!= -1) {
						var leftdown = jsonLines[i].slice(0, s).match(/[{\[]/);
						var leftup = jsonLines[i].slice(0, s).match(/[}\]]/);
						if (depth + leftdown - leftup > 0) {
							s = -1;
						}
					}
				}
				if (s != -1) {
					return [i, s];
				} else {
					if (i==headLine) {
						var down = jsonLines[i].slice(headChar+1).match(/[{\[]/);
						var up = jsonLines[i].slice(headChar+1).match(/[}\]]/);
						if (down != null) {
							depth += down.length;
						}
						if (up != null) {
							depth -= up.length;
						}
					} else {
						var down = jsonLines[i].match(/[{\[]/);
						var up = jsonLines[i].match(/[}\]]/);
						if (down != null) {
							depth += down.length;
						}
						if (up != null) {
							depth -= up.length;
						}
					}
				}
			}
		},
		
		validateObjectIds: function(json, path, decTable, refTable) {
			//DONE: check "controller".constructorSettings.model is an objectId
			if (path === undefined || path === null) {
				path = [];
			}
			if (decTable === undefined || decTable === null) {
				decTable = {};
			}
			if (refTable === undefined || refTable === null) {
				refTable = {};
			}
			var type = designer.util.JsonError.jsonType(json);
			if (type == "object") {
				for (var key in json) {
					if (path[path.length-2] == "data" && path[path.length-1] == "simple") {
						if (decTable[key] !== undefined) {
							throw({
								message: "Duplicate objectId",
								id: key,
								originalPath: decTable[key]["path"],
								duplicatePath: path.concat([key])
							});
						} else {
							decTable[key] = {
								"path": path.concat([key]), 
								"class": "qx.core.Object"
							};
							if (refTable[key] && refTable[key]["reqs"]["form"] && !qx.Class.isSubClassOf(qx.Class.getByName(decTable[key]["class"]), qx.Class.getByName("blueprint.data.Form"))) {
								throw({
									message: "Not a form",
									id: key,
									decPath: path.concat([key]),
									decClass: "qx.core.Object",
									refPath: refTable[json[key]]["path"]
								});
							}
						}
					} else if (key == "objectId" && json[key] != "") {
						if (decTable[json[key]] !== undefined) {
							throw({
								message: "Duplicate objectId",
								id: json[key],
								originalPath: decTable[json[key]]["path"],
								duplicatePath: path
							});
						} else {
							decTable[json[key]] = {
								"path": path,
								"class": json["objectClass"]
							};
							if (refTable[json[key]] && refTable[json[key]]["reqs"]["form"] && !qx.Class.isSubClassOf(qx.Class.getByName(json["objectClass"]), qx.Class.getByName("blueprint.data.Form"))) {
								throw({
									message: "Not a form",
									id: json[key],
									decPath: path,
									decClass: json["objectClass"],
									refPath: refTable[json[key]]["path"]
								});
							} else {
								refTable[json[key]] = undefined;
							}
						}
					} else if (designer.util.JsonError.jsonType(json[key]) == "string" && (key == "sourceId" || key == "targetId" || key == "eventObj" || path[path.length-1] == "components")) {
						if (refTable[json[key]] == undefined && decTable[json[key]] == undefined) {
							refTable[json[key]] = {
								"path": path.concat([key]),
								"reqs": {}
							};
						}
					} else if (designer.util.JsonError.jsonType(json[key]) == "string" && path[path.length-1] == "qxSettings" && key == "blueprintForm") {
						if (refTable[json[key]] == undefined && decTable[json[key]] == undefined) {
							refTable[json[key]] = {
								"path": path.concat([key]),
								"reqs": {"form": true}
							};
						} else if (refTable[json[key]] == undefined && decTable[json[key]] != undefined) {
							if (!qx.Class.isSubClassOf(qx.Class.getByName(decTable[json[key]]["class"]), qx.Class.getByName("blueprint.data.Form"))) {
								throw({
									message: "Not a form",
									id: json[key],
									decPath: decTable[json[key]]["path"],
									decClass: decTable[json[key]]["class"],
									refPath: path.concat([key])
								});
							}
						} else if (refTable[json[key]] != undefined) {
							if (!refTable[json[key]]["reqs"]["form"]) {
								refTable[json[key]] = {
									"path": path.concat([key]),
									"reqs": {"form": true}
								};
							}
						}
					} else if (designer.util.JsonError.jsonType(json[key]) == "string" && path[path.length-3] == "controllers" && path[path.length-1] == "constructorSettings" && key == "model") {
						if (refTable[json[key]] == undefined && decTable[json[key]] == undefined) {
							refTable[json[key]] = {
								"path": path.concat([key]),
								"reqs": {}
							};
						}
					} else {
						var result = designer.util.JsonError.validateObjectIds(json[key], path.concat([key]), decTable, refTable);
						decTable = result[0];
						refTable = result[1];
					}
				}
			} else if (type == "array") {
				for (var i=0; i < json.length; i++) {
					var result = designer.util.JsonError.validateObjectIds(json[i], path.concat([i]), decTable, refTable);
					decTable = result[0];
					refTable = result[1];
				}
			}
			return [decTable, refTable];
		},
		//if anything is in refTable at the end, it's an error
		
		jsonType: function(json) {
			if (qx.lang.Type.isArray(json)) {
				return "array";
			} else if (qx.lang.Type.isBoolean(json)) {
				return "boolean";
			} else if (qx.lang.Type.isString(json)) {
				return "string";
			} else if (qx.lang.Type.isNumber(json)) {
				return "number";
			} else if (json === null) {
				return "null";
			} else if (qx.lang.Type.isObject(json)) {
				return "object";
			}
		},
		
		normalizeCoords: function(coords) {
			return [coords[0]+1, coords[1]+1];
		},

		humanitize: function(json, schema, error) {
			var schemaLines = schema.split("\n");
			var jsonLines = json.split("\n")
			var schemaParsed = qx.lang.Json.parse(schema);
			var jsonParsed = qx.lang.Json.parse(json);
			var schemaCoords = designer.util.JsonError.findLineByUrn(schemaLines, error.schemaUri);
			try {
				var jsonCoords = designer.util.JsonError.findLineByUrn(jsonLines, error.uri);
			} catch (e) {
				var jsonCoords = designer.util.JsonError.findLineByUrn(jsonLines, error.uri.slice(0, error.uri.lastIndexOf('/')));
			}
			if (error.attribute == "additionalProperties" && error.details === false) {
				//FIXED: this only works if there are defined properties, not if there are patternProperties
				var goodProps = designer.util.JsonError.getObjectByUrn(schemaParsed, error.schemaUri).properties;
				if (goodProps === undefined) {
					goodProps = {};
				}
				var goodPatternString = designer.util.JsonError.getObjectByUrn(schemaParsed, error.schemaUri).patternProperties;
				if (goodPatternString === undefined) {
					//var goodPattern = /a^/;
				} else {
					var goodPattern = new RegExp(goodPatternString)
				}
				var usedProps = designer.util.JsonError.getObjectByUrn(jsonParsed, error.uri);
				var badProps = {};
				for (var i in usedProps) {
					if (goodProps[i] === undefined && (goodPatternString === undefined || !goodPattern.test(i))) {
						badProps[i] = designer.util.JsonError.findLineOfProperty(jsonLines, i, jsonCoords[0], jsonCoords[1]);
					}
				}
				var outstring = "Additional Properties error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				outstring += "additionalProperties is set to false, but the following properties are not in the schema properties list:\n";
				for (var i in badProps) {
					outstring += '"' + i + '" near j' + this.normalizeCoords(badProps[i]) + ".\n";
				}
				var outJsonCoords = badProps[i];
				var outSchemaCoords = schemaCoords;
			} else if ((error.attribute == "optional" && error.details === false) || (error.attribute == "required" && error.details === true)) {
				var missingProp = error.uri.slice(error.uri.lastIndexOf('/')+1);
				var outstring = "Missing property error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				outstring += "The property \"" + missingProp + "\" is required by the schema, but has not been defined.\n";
				var outJsonCoords = jsonCoords;
				var outSchemaCoords = schemaCoords;
			} else if (error.attribute == "type") {
				var wrongProp = error.uri.slice(error.uri.lastIndexOf('/')+1);
				var wrongType = designer.util.JsonError.jsonType(designer.util.JsonError.getObjectByUrn(jsonParsed, error.uri));
				var parentCoords = designer.util.JsonError.findLineByUrn(jsonLines, error.uri.slice(0, error.uri.lastIndexOf('/')));
				var propCoords = designer.util.JsonError.findLineOfProperty(jsonLines, wrongProp, parentCoords[0], parentCoords[1]);
				var outstring = "Wrong Type error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				outstring += "The property \"" + wrongProp + "\" near j" + this.normalizeCoords(propCoords) + " is of type " + wrongType + " but should be of type " + error.details + ".\n";
				var outJsonCoords = propCoords;
				var outSchemaCoords = schemaCoords;
			} else if (error.attribute == "pattern") {
				var wrongProp = error.uri.slice(error.uri.lastIndexOf('/')+1);
				var parentCoords = designer.util.JsonError.findLineByUrn(jsonLines, error.uri.slice(0, error.uri.lastIndexOf('/')));
				var propCoords = designer.util.JsonError.findLineOfProperty(jsonLines, wrongProp, parentCoords[0], parentCoords[1]);
				var outstring = "Unmatched Pattern error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				outstring += "The property \"" + wrongProp + "\" near j" + this.normalizeCoords(propCoords) + " does not match the pattern " + error.details + ".\n";
				var outJsonCoords = propCoords;
				var outSchemaCoords = schemaCoords;
			} else if (error.attribute == "minItems") {
				var wrongProp = error.uri.slice(error.uri.lastIndexOf('/')+1);
				var wrongNum = designer.util.JsonError.getObjectByUrn(jsonParsed, error.uri).length;
				var outstring = "Items below minimum error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				outstring += "The array \"" + wrongProp + "\" near j" + this.normalizeCoords(jsonCoords) + " has " + wrongNum + " items, but needs to have at least " + error.details + ".\n";
				var outJsonCoords = jsonCoords;
				var outSchemaCoords = schemaCoords;
			} else {
				var outstring = "Unknown Error near j"+this.normalizeCoords(jsonCoords)+", s"+this.normalizeCoords(schemaCoords)+":\n";
				for (var i in error) {
					outstring += i + ": " + error[i] + "\n";
				}
				var outJsonCoords = jsonCoords;
				var outSchemaCoords = schemaCoords;
			}
			return [outstring, this.normalizeCoords(outJsonCoords), this.normalizeCoords(outSchemaCoords)];
		}
	}
});
