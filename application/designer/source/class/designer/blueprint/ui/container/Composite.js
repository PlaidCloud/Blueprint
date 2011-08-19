/* ***********************************************

Tartan Blueprint

Copyright 2011 Tartan Solutions, Inc

License:
LGPL: http://www.gnu.org/licenses/lgpl.html
EPL: http://www.eclipse.org/org/documents/epl-v10.php
See the LICENSE file in the project's top-level directory for details.

Authors:
* 
*/

qx.Class.define("designer.blueprint.ui.container.Composite",
{
    extend  : blueprint.ui.container.Composite,
    include : [
        designer.util.MJson, 
        designer.util.MMovable,
        designer.util.MResizable
    ]
});