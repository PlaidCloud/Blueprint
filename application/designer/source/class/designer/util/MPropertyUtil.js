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

/** A Mixin for getting the properties of this class, and for getting
 *  their definition.
 */
qx.Mixin.define("designer.util.MPropertyUtil", {
    members: {
        /** @return Returns a list of all properties supported by the 
         *  class of this object. 
         */
        getProperties: function() {
            return qx.Class.getProperties(qx.Class.getByName(this.classname));
        },
        
        /** @param name The name of the property to be defined.
         *  @return Returns the definition of the given property.
         */
        getPropertyDefinition: function(name) {
            return qx.Class.getPropertyDefinition(qx.Class.getByName(this.classname), name);
        }
    }
}); 
