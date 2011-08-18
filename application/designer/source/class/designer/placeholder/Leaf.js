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


/** A placeholder object that represents a generic non-container widget.
 */
qx.Class.define("designer.placeholder.Leaf", {
    extend: qx.ui.core.Widget,

    include: [
        //designer.util.MJson,
        designer.util.MMovable,
        designer.util.MResizable
    ],

    /** @param genId The generated ID of the object to be represented.
     */
    construct: function() {
        this.base(arguments);
        //this.setGeneratedId(genId);
        this.setBackgroundColor("blue");
        //this.setRepClassName(qx.core.Init.getApplication().getManager().getObjectClass(this.getGeneratedId()));
    },

    properties: {
        /** The class of the represented object. 
         */
        repClassName: {
            check: "String"
        },
        
        /** The generate ID of the represented object.
         */
        generatedId : {
  		    "check" : "String",
  		    apply : "_applyGeneratedId"
  	    }
    },

    members: {
        _applyGeneratedId : function(value, old) {
            this.setRepClassName(qx.core.Init.getApplication().getManager().getObjectClass(value));
            //this.setWindowTitle(this.getPropertyByName("caption")); //this will likely need to be changed once placeholders are different
        },
    
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
