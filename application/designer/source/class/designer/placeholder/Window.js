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


/** A placeholder object that represents a window in the json, but is
 *  not itself a window.
 */
qx.Class.define("designer.placeholder.Window", {
    extend: qx.ui.container.Composite,

    include: [
        //designer.util.MJson,
        //designer.util.MMovable,
        designer.util.MResizable
    ],

    /** @param genID The generated ID of the window object to be represented.
     */
    construct: function(genId) {
        this.base(arguments, new qx.ui.layout.Dock());
                        
        var title = new qx.ui.basic.Label().set({
            value: "",
            textAlign: "left",
            rich: true,
            allowGrowX: true,
            padding: 3,
            decorator: "window-captionbar-active"
        });
        
        if (this.getWindowTitle() === null) {
            this.setWindowTitle("");      
        }
        this.bind("windowTitle", title, "value");
        
        if (this.getInnerLayout() === null) {
            this.setInnerLayout(new qx.ui.layout.Canvas());
        }
        
        var innercanvas = new qx.ui.container.Composite(this.getInnerLayout());
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
        
        //this.add(new qx.ui.form.Button("test"));
    },

    properties: {
        /** The class of the represented object. 
         */
        repClassName: {
            check: "String"
        },
        
        /** The caption to put in the window header.
         */
        windowTitle: {
            check: "String",
            event: "changeWindowTitle",
            nullable: true,
            init: null
        },
        
        /** The layout to use for the inner canvas
         */
        innerLayout: {
            check: "qx.ui.layout.Abstract",
            nullable: true,
            init: null
        },
        
        /** The canvas inside the window, that things added to the
         *  window are actually added to.
         */
        innerCanvas: {
            check: "qx.ui.container.Composite"
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
            this.setWindowTitle("<font color='white' size='2'>"+this.getPropertyByName("caption")+"</font>"); //this will likely need to be changed once placeholders are different
            this.setInnerLayout(blueprint.util.misc.Layout.generateLayout(this.getConstructorSettingByName("innerLayout")));
            this.getInnerCanvas().setLayout(this.getInnerLayout); //TODO: add support for component object layout
        },
    
        /** Adds a widget to the window.
         *  @param child The widget to be added.
         *  @param options The options to be used.
         *  @param internal If false, will add it to the top level 
         *                  placeholder. If true or undefined, will add 
         *                  it to the inner canvas.
         */
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
          
          /** DEPRECATED AT BIRTH
          *  probably going to be replaced with just selectors
          *  Sets a setting by name.
          *  @param prop The setting to be set.
          *  @param val The value the setting will be set to.
          */
         setConstructorSettingByName: function(prop, val) {
             qx.core.Init.getApplication().getManager().setConstructorSetting(this.getGeneratedId(), prop, val);
         },
         
         /** DEPRECATED AT BIRTH
          *  probably going to be replaced with just selectors
          *  Gets a setting by name.
          *  @param prop The setting to be set.
          *  @returns Returns the value of the setting.
          */
          getConstructorSettingByName: function(prop) {
              return qx.core.Init.getApplication().getManager().getConstructorSetting(this.getGeneratedId(), prop);
          }
    },

    destruct: function() {
    }
});
