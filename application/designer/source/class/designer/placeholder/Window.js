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


/** TODOC
 */
qx.Class.define("designer.placeholder.Window", {
    extend: qx.ui.container.Composite,

    include: [
        designer.util.MJson,
        //designer.util.MMovable,
        designer.util.MResizable
    ],

    /** TODOC
     */
    construct: function(genId) {
        this.base(arguments, new qx.ui.layout.Canvas());
        
        this.setGeneratedId(genId);
        this.setBackgroundColor("blue");
        //UNCOMMENT WHEN DONE TESTING!
        //this.setRepClassName(qx.core.Init.getApplication().getManager().getObjectClass(this.getGeneratedId()));
        
        //var greyPane = new qx.ui.core.Widget();

    },

    properties: {
        /** The class of the represented object. 
         */
        repClassName: {
            check: "String"
        }
    },

    members: {
        /** @return Returns a list of all properties supported by the 
         *  class of the represented object. 
         */
        getProperties: function() {
            qx.core.Assert.assertNotUndefined(this.getRepClassName(), "This placeholder doesn't represent anything.");
            return qx.Class.getProperties(qx.Class.getByName(this.getRepClassName()));
        },
        
        /** @param name The name of the property to be defined.
         *  @return Returns the definition of the given property.
         */
         getPropertyDefinition: function(name) {
             qx.core.Assert.assertNotUndefined(this.getRepClassName(), "This placeholder doesn't represent anything.");
             return qx.Class.getPropertyDefinition(qx.Class.getByName(this.getRepClassName()), name);
         },
         
         /** DEPRECATED AT BIRTH
          *  probably going to be replaced with just selectors
          *  Sets a property by name.
          *  @param prop The property to be set.
          *  @param val The value the property will be set to.
          */
         setPropertyByName: function(prop, val) {
             qx.core.Init.getApplication().getManager().setProperty(this.getGeneratedId, prop, val);
         },
         
         /** DEPRECATED AT BIRTH
          *  probably going to be replaced with just selectors
          *  Gets a property by name.
          *  @param prop The property to be set.
          *  @returns Returns the value of the property.
          */
          getPropertyByName: function(prop) {
              return qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId, prop);
          }
    },

    destruct: function() {
    }
});
