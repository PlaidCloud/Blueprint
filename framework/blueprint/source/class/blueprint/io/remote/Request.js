/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

qx.Class.define("blueprint.io.remote.Request",
{
    extend : qx.io.remote.Request,

    properties :
    {
        newObject :
        {
            check: "qx.core.Object",
            nullable: true,
            init: null
        }
    }
});