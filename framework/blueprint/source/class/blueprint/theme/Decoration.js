/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

qx.Theme.define("blueprint.theme.Decoration",
{
    extend : qx.theme.modern.Decoration,

    decorations :
    {
        "invalid" :
        {
            decorator : qx.ui.decoration.Beveled,

            style :
            {
                outerColor : "border-invalid",
                innerColor : "border-invalid",
                innerOpacity : 0.5,
                backgroundColor : "background-invalid"
            }
        },

        "input-invalid" :
        {
            decorator : qx.ui.decoration.Beveled,

            style :
            {
                outerColor : "red",
                innerOpacity : 0.5,
                backgroundImage : "decoration/form/input.png",
                backgroundRepeat : "repeat-x",
                backgroundColor : "background-light"
            }
        },

        "input-invalid-focused" :
        {
            decorator : qx.ui.decoration.Beveled,

            style :
            {
                outerColor : "red",
                innerColor : "border-focused",
                backgroundImage : "decoration/form/input-focused.png",
                backgroundRepeat : "repeat-x",
                backgroundColor : "background-light"
            }
        },

        "highlight-blue" :
        {
            decorator : qx.ui.decoration.Grid,

            style : {
                baseImage : "blueprint/decoration/highlight-blue/highlight-blue.png",
                insets    : [ 10, 10, 10, 10 ]
            }
        },

        "highlight-green" :
        {
            decorator : qx.ui.decoration.Grid,

            style : {
                baseImage : "blueprint/decoration/highlight-green/highlight-green.png",
                insets    : [ 10, 10, 10, 10 ]
            }
        },

        "highlight-red" :
        {
            decorator : qx.ui.decoration.Grid,

            style : {
                baseImage : "blueprint/decoration/highlight-red/highlight-red.png",
                insets    : [ 10, 10, 10, 10 ]
            }
        },

        "highlight-yellow" :
        {
            decorator : qx.ui.decoration.Grid,

            style : {
                baseImage : "blueprint/decoration/highlight-yellow/highlight-yellow.png",
                insets    : [ 10, 10, 10, 10 ]
            }
        }
    }
});