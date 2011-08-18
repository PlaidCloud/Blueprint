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
        this.base(arguments, new qx.ui.layout.Dock());
        
        this.setGeneratedId(genId);
        UNCOMMENT WHEN DONE TESTING!
        this.setRepClassName(qx.core.Init.getApplication().getManager().getObjectClass(this.getGeneratedId()));
                
        var title = new qx.ui.basic.Label().set({
            value: "",
            textAlign: "center",
            rich: true,
            allowGrowX: true,
            padding: 3,
            decorator: "window-captionbar-active"
        });
        
        this.setWindowTitle(this.getPropertyByName("caption")); //this will likely need to be changed once placeholders are different
        this.bind("windowTitle", title, "value");
        
        var innercanvas = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
        innercanvas.setDecorator("window");
        
        innercanvas.setWidth(100);
        innercanvas.setHeight(100);

        this.add(title, {
            edge: "north"
        }, false);
        this.add(innercanvas, {
            edge: "center"
        }, false);
        this.setDecorator("pane");
        this.setInnerCanvas(innercanvas);
        
        this.add(new qx.ui.form.Button("test"));
    },

    properties: {
        /** The class of the represented object. 
         */
        repClassName: {
            check: "String"
        },
        
        windowTitle: {
            check: "String",
            event: "changeWindowTitle"
        },
        
        innerCanvas: {
            check: "qx.ui.container.Composite"
        }
    },

    members: {
        add: function(child, options, internal) {
            this.debug(child);
            this.debug(internal);
            if (internal === undefined) {
                internal = true;
            }
            
            if (internal) {
                this.getInnerCanvas().add(child, options);
            } else {
                this.base(arguments, child, options);
            }
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
