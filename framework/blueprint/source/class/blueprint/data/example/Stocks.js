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

qx.Class.define("blueprint.data.example.Stocks",
{
    extend : blueprint.data.Object,
    
    include :
    [
    blueprint.MBlueprintManager
    ],

    construct : function(vData, namespace, skipRecursion)
    {
        this.base(arguments);
        
        if (vData.qxSettings.value != undefined) { vData.qxSettings.value = new qx.data.Array(vData.qxSettings.value); }
        
        this.set(vData.qxSettings);
        
        this.setStocks(new Object());
        
        this.updateStocks();
        
        var timer = new qx.event.Timer(this.getUpdate() * 1000);
        
        timer.addListener("interval", this.updateStocks, this);
        
        timer.start();
    },
    
    properties :
    {
        update :
        {
            check: "Number"
        },
        
        stocks :
        {
            check: "Object"
        }
    },
    
    members :
    {
        updateStocks : function()
        {
            var request = new qx.io.remote.Request("http://localhost/framework/stocks.php", "GET", "application/json");
            
            request.setFormField("q", this.getValue().join(","));
            
            request.addListener("completed", function(e)
            {
                var stocksObj = new Object();
                for (var i=0;i<e.getContent().length;i++) {
                    stocksObj[e.getContent()[i]['t']] = e.getContent()[i];
                }
                this.setStocks(stocksObj);
            }, this);
            
            request.send();
        },
        
        addTicker : function(ticker)
        {
            this.getValue().push(ticker);
            this.updateStocks();
        },
        
        delTicker : function(item)
        {
            this.getValue().remove(String(item));
        }
    }
});