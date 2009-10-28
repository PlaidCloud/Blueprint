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

    construct : function(sym, up)
    {
        this.base(arguments);
        
        var qxSymbols = new qx.data.Array(sym);
        
        this.set({value: qxSymbols, update: up});
        
        this.updateStocks();
        
        var timer = new qx.event.Timer(up * 1000);
        
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
            check: "Array"
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
                this.setStocks(e.getContent());
            }, this);
            
            request.send();
        }
    }
});