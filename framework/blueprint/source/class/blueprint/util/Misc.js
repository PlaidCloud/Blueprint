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

qx.Bootstrap.define("blueprint.util.Misc", {
    type : "static",

    statics :
    {
        combineJson : function(base_json, override_json) {
            var new_json = new Object();

            for (var node in base_json) {
                new_json[node] = base_json[node];
            }
            for (var node in override_json) {
                new_json[node] = override_json[node];
            }
            return new_json;
        },

        buildListener : function(functionObj, functionName, argsObj) {
            return function(e) {
                // Clone the args object so the function value replacement will happen on every call.
                var args = qx.lang.Array.clone(argsObj);
                for (var a=0;a<args.length;a++) {
                    if (qx.lang.Type.isObject(args[a]) && qx.lang.Object.getLength(args[a]) == 2 && blueprint.util.Registry.getInstance().check(this, args[a]["objectId"])) {
                        // Replace this argument with the result of the function. Right now, this only supports functions without arguments.
                        args[a] = blueprint.util.Registry.getInstance().get(this, args[a]["objectId"])[args[a]["functionName"]]();
                    }
                }
                // Call the function on the object.
                functionObj[functionName].apply(functionObj, args);
            }
        },

        copyJson : function(json) {
            return qx.util.Json.parseQx(qx.util.Json.stringify(json));
        },

        generateLayout : function(layout_type) {
            var new_layout;
            switch(layout_type) {
                case 'qx.ui.layout.Canvas':
                new_layout = new qx.ui.layout.Canvas();
                break;

                case 'qx.ui.layout.Dock':
                new_layout = new qx.ui.layout.Dock();
                break;

                case 'qx.ui.layout.Grid':
                new_layout = new qx.ui.layout.Grid();
                break;

                case 'qx.ui.layout.Grow':
                new_layout = new qx.ui.layout.Grow();
                break;

                case 'qx.ui.layout.HBox':
                new_layout = new qx.ui.layout.HBox();
                break;

                case 'qx.ui.layout.VBox':
                new_layout = new qx.ui.layout.VBox();
                break;
            }

            return new_layout;
        },

        replaceVariables : function(caller, text) {
            var newText = text;
            var matches = newText.match(/\$[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (matches != null) {
                for (var i=0;i<matches.length;i++) {
                    if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\$/g, ''))) {
                        newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getByNamespace(\"" + caller.getBlueprintNamespace() + "\", '" + matches[i].replace(/\$/g, '') + "')");
                    }
                }
            }
            
            matches = newText.match(/\@[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (matches != null) {
                for (var i=0;i<matches.length;i++) {
                    if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\@/g, ''))) {
                        newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getFunctionByNamespace(\"" + caller.getBlueprintNamespace() + "\", '" + matches[i].replace(/\@/g, '') + "')");
                    }
                }
            }

            return newText;
        }
    }
});