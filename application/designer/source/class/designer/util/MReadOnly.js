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

qx.Mixin.define("designer.util.MReadOnly",
{
  construct : function() {
    this.makeAllReadonly();
  },
  
  properties : {},

  members :
  {
    /**
     * TODOC
     *
     * @return {void} 
     */
    makeAllReadonly : function()
    {
      if (qx.lang.Type.isFunction(this.setReadOnly)) {
          this.setReadOnly(true);
      }

      var childControls = this._getCreatedChildControls() || [];

      for (var i in childControls)
      {
        if (qx.lang.Type.isFunction(childControls[i].setReadOnly)) {
            childControls[i].setReadOnly(true);
        }
      }
    }
  },

  destruct : function() {}
});
