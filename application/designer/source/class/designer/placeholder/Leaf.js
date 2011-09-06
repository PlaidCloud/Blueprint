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
    extend: qx.ui.container.Composite,

    include: [
        designer.util.MSelectable
    ],

    /** @param genId The generated ID of the object to be represented.
     */
    construct: function() {
        this.base(arguments);
        this.setLayout(new qx.ui.layout.VBox());
        
        this._label = new qx.ui.basic.Label();
        this.bind("repClassName", this._label, "value");
        this.add(this._label);
        
        this._image = null;
    },

    properties: {
        /** The class of the represented object. 
         */
        repClassName: {
            check: "String",
            event: "changeRepClassName",
            init: "not yet set"
        },
        
        /** The generate ID of the represented object.
         */
        generatedId : {
  		    "check" : "String",
  		    apply : "_applyGeneratedId"
  	    }
    },

    members: {
        _images: {
            "plaid.ui.treevirtual.CheckTree": "builder/placeholder/treevirtual.png"
        },
        _applyGeneratedId : function(value, old) {
            this.setRepClassName(qx.core.Init.getApplication().getManager().getObjectClass(value));
            if (this._image) {
                this.remove(this._image);
            }
            if (this._images[this.getRepClassName()]) {
                this._image = new qx.ui.basic.Image(this._images[this.getRepClassName()])
                this.debug("Adams, Leaf, You should switch " + this.getRepClassName() + " to point to a subclass of Leaf");
                this.add(this._image);
            } else if(this._imagePath) {
                this.debug("Adams, Leaf, adding image the right way")
                this._image = new qx.ui.basic.Image(this._imagePath);
                this.add(this._image);
            } else {
                this.debug("Adams, Leaf, no image available defined in any way for " + this.getRepClassName());
                this._image = null;
            }
            
            this.setWidth(qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), "width"));
            this.setHeight(qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), "height"));
            this.setMaxWidth(qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), "width"));
            this.setMaxHeight(qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), "height"));
            this.setAllowGrowX(false);
            this.setAllowGrowY(false);
            this.setAllowShrinkX(false);
            this.setAllowShrinkY(false);
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
             qx.core.Init.getApplication().getManager().setProperty(this.getGeneratedId(), prop, val);
         },
         
         /** DEPRECATED AT BIRTH
          *  probably going to be replaced with just selectors
          *  Gets a property by name.
          *  @param prop The property to be set.
          *  @returns Returns the value of the property.
          */
          getPropertyByName: function(prop) {
              return qx.core.Init.getApplication().getManager().getProperty(this.getGeneratedId(), prop);
          },
          
          layoutAdd: function() {
              this.debug("Adams, Leaf, layoutAdd is being called. This probably shouldn't be happening.");
          }
    },

    destruct: function() {
    }
});
