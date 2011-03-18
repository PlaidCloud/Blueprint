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
        combineJson : function(base_json, override_json)
        {
            var new_json = new Object();

            for (var node in base_json) {
                new_json[node] = base_json[node];
            }
            for (var node in override_json) {
                new_json[node] = override_json[node];
            }
            return new_json;
        },

        buildArgs : function(argsObj, namespace)
        {
            var args = qx.lang.Array.clone(argsObj);
            
            for (var a=0;a<args.length;a++) {
                if (qx.lang.Object.getLength(args[a]) == 1) {
                    if (args[a]["eventObj"]) {
                        args[a] = blueprint.util.Registry.getInstance().getByNamespace(namespace, args[a]["eventObj"]);
                    }
                    
                    if (args[a]["eventFunct"]) {
                        this.warn("TODO: Add support calling registered blueprint functions");
                    }
                } else {
                    if (args[a]["eventObj"] && args[a]["eventFunct"]) {
                        var obj = blueprint.util.Registry.getInstance().getByNamespace(namespace, args[a]["eventObj"]);
                        if (qx.lang.Type.isFunction(obj[args[a]["eventFunct"]])) {
                            var funct = obj[args[a]["eventFunct"]];
                            if (!args[a]["eventArgs"]) { args[a]["eventArgs"] = []; }
                            var functArgs = blueprint.util.Misc.buildArgs(args[a]["eventArgs"], namespace);
                            
                            if (obj && funct) {
                                args[a] = funct.apply(obj, functArgs);
                            }
                        }
                    }
                }
            }
            
            return args;
        },

        buildListener : function(functionObj, namespace)
        {
            return function(e) {
                var obj, funct, args;
                
                if (functionObj["eventObj"]) {
                    obj = blueprint.util.Registry.getInstance().getByNamespace(namespace, functionObj["eventObj"]);
                    funct = obj[functionObj["eventFunct"]];
                } else {
                    this.warn("TODO: Add support calling registered blueprint functions");
                    obj = null;
                    funct = null;
                }
                
                if (functionObj["eventArgs"]) {
                    args = blueprint.util.Misc.buildArgs(functionObj["eventArgs"], namespace);
                } else {
                    args = [];
                }
                
                funct.apply(obj, args);
            }
        },

        copyJson : function(json)
        {
            return qx.util.Json.parse(qx.util.Json.stringify(json));
        },

        generateLayout : function(layout_type)
        {
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

        getDeepKey : function(map, arr, index)
        {
            if (!index) { index = 0; }
            if (arr.length > (index + 1)) {
                if (map[arr[index]] === undefined) {
                    return undefined;
                } else {
                    return this.getDeepKey(map[arr[index]], arr, index + 1);
                }
            } else {
                return map[arr[index]];
            }
        },

        setDeepKey : function(map, arr, value, index)
        {
            if (!index) { index = 0; }
            if (arr.length > (index + 1)) {
                if (map[arr[index]] === undefined) {
                    map[arr[index]] = new Object();
                }
                this.setDeepKey(map[arr[index]], arr, value, index + 1);
            } else {
                map[arr[index]] = value;
            }
        },

        loadInclude : function(url, top_container, namespace)
        {
            var head= document.getElementsByTagName('head')[0];
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.src= url;

            // then bind the event to the callback function 
            // there are several events for cross browser compatibility
            script.onreadystatechange = blueprint.util.Misc.includeCallback;
            script.onload = blueprint.util.Misc.includeCallback;

            // Include files can access these variables via:
            // document.getElementsByTagName("script")[scripts.length-1].bp<var>;
            script.bpNamespace = namespace;
            script.bpTopContainer = this;
            script.bpRegistry = blueprint.util.Registry.getInstance();
            script.bpApp = qx.core.Init.getApplication();

            // fire the loading
            head.appendChild(script);
        },

        includeCallback : function(e)
        {
            //I don't have anything to put here right now.
        },

        replaceVariables : function(caller, text)
        {
            var newText = text;
            var matches = newText.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)(:[a-zA-Z_][a-zA-Z0-9_]*)?/g);
            if (matches != null) {
                for (var i=0;i<matches.length;i++) {
                    if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\$/g, ''))) {
                        var ns;
                        if (matches[i].split(":").length == 1) {
                            ns = caller.getBlueprintNamespace();
                            v = matches[i];
                        } else {
                            ns = matches[i].split(":")[0];
                            v = matches[i].split(":")[1];
                        }
                        
                        newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getByNamespace(\"" + ns.replace(/\$/g, '') + "\", '" + v.replace(/\$/g, '') + "')");
                    }
                }
            }
            
            matches = newText.match(/\@([a-zA-Z_][a-zA-Z0-9_]*)(:[a-zA-Z_][a-zA-Z0-9_]*)?/g);
            if (matches != null) {
                for (var i=0;i<matches.length;i++) {
                    if (blueprint.util.Registry.getInstance().check(caller, matches[i].replace(/\@/g, ''))) {
                        var ns;
                        var v;
                        if (matches[i].split(":").length == 1) {
                            ns = caller.getBlueprintNamespace();
                            v = matches[i];
                        } else {
                            ns = matches[i].split(":")[0];
                            v = matches[i].split(":")[1];
                        }
                        
                        newText = newText.replace(matches[i], "blueprint.util.Registry.getInstance().getFunctionByNamespace(\"" + ns.replace(/\@/g, '') + "\", '" + v.replace(/\@/g, '') + "')");
                    }
                }
            }

            return newText;
        }
    }
});