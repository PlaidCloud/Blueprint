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

qx.Bootstrap.define("blueprint.util.Schema", {
    type : "static",

    statics :
    {
        blueprint : {
            "object" : {
                "properties" : {
                    "objectClass": {
                        "nullable" : false,
                        "type" : "String"
                    },
                    "objectId": {
                        "type" : "String"
                    },
                    "type": {
                        "check" : "object",
                        "type" : "String"
                    },
                    "qxSettings": {
                        "check" : "$qxSettings",
                        "type" : "Object"
                    },
                    "constructorSettings": {
                        "check" : "$constructorSettings",
                        "type" : "Object"
                    },
                    "contents": {
                        "check" : "$contents",
                        "type" : "Array"
                    },
                    "components": {
                        "check" : "$components",
                        "type" : "Object"
                    }
                }
            },
            
            "top_container" : {
                "extend" : "object",
                "properties" : {
                    "type": {
                        "refine" : true,
                        "check" : ["top_container", "application_container"],
                        "type" : "String"
                    },
                    "scripts": {
                        "check" : "$blueprintScripts",
                        "type" : "Object"
                    },
                    "functions": {
                        "check" : "$blueprintFunctions",
                        "type" : "Object"
                    }
                }
            }
        }
    }
});