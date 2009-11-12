/* ************************************************************************

Tartan Blueprint Designer

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

qx.Class.define("designer.data.Elements",
{
    extend : blueprint.data.Object,
    
    include :
    [
    blueprint.MBlueprintManager
    ],

    /*
    *****************************************************************************
    CONSTRUCTOR
    *****************************************************************************
    */
    construct : function(vData, namespace, skipRecursion)
    {
        this.base(arguments);
        
        if (vData.qxSettings.value == undefined) {
            this.setValue(new qx.data.Array());
        } else {
            vData.qxSettings.value = new qx.data.Array(vData.qxSettings.value);
        }
        
        if (vData.qxSettings.metaData == undefined) {
            this.setMetaData(new Object());
        }
        
        this.set(vData.qxSettings);
    },

    /*
    *****************************************************************************
    PROPERTIES
    *****************************************************************************
    */

    properties :
    {
        metaData :
        {
            check: "Object"
        }
    },


    /*
    *****************************************************************************
    MEMBERS
    *****************************************************************************
    */

    members :
    {
        addElement : function(name, value, type)
        {
            var fullName = String(name + ' - ' + type);
            this.getValue().push(fullName);
            this.getMetaData()[fullName] = new Object();
            this.getMetaData()[fullName]["name"] = name;
            this.getMetaData()[fullName]["value"] = value;
            this.getMetaData()[fullName]["type"] = type;
        },
        
        removeElement : function(fullName)
        {
            this.getValue().remove(String(fullName));
            delete this.getMetaData()[fullName];
        },
        
        getDataValue : function(fullName)
        {
            if (fullName != undefined) {
                return String(this.getMetaData()[fullName]["value"]);
            } else {
                return "Please select a value";
            }
        },
        
        getDataType : function(fullName)
        {
            return this.getMetaData()[fullName]["type"];
        },
        
        getDataName : function(fullName)
        {
            return this.getMetaData()[fullName]["name"];
        },
        
        setDataValue : function(fullName, value)
        {
            // TODO: Check the data type before setting it.
            this.getMetaData()[fullName]["value"] = value;
        }
    },

    /*
    *****************************************************************************
    DESTRUCTOR
    *****************************************************************************
    */

    destruct : function()
    {

    }
});