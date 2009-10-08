/* ************************************************************************



************************************************************************ */

/**
 * The image cell renderer renders image into table cells.
 */
qx.Theme.define("blueprint.theme.ninja.Font",
{
  extend : qx.theme.modern.Font,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  fonts :
  {
    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */
    "watermark" :
    {
      size : qx.bom.client.System.WINVISTA ? 72 : 72,
      lineHeight : 1,
      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
        qx.bom.client.System.WINVISTA ? [ "Tahoma", "Liberation Sans", "Arial" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ],
      bold : false
	},
    "default" :
    {
      size : qx.bom.client.System.WINVISTA ? 11 : 11,
      lineHeight : 1.4,
      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
        qx.bom.client.System.WINVISTA ? [ "Tahoma", "Liberation Sans", "Arial" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ]
    },
    "bold" :
    {
      size : qx.bom.client.System.WINVISTA ? 11 : 11,
      lineHeight : 1.4,
      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
        qx.bom.client.System.WINVISTA ? [ "Tahoma", "Liberation Sans", "Arial" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ],
      bold : true
    },

    "small" :
    {
      size : qx.bom.client.System.WINVISTA ? 10 : 10,
      lineHeight : 1.4,
      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
        qx.bom.client.System.WINVISTA ? [ "Tahoma", "Liberation Sans", "Arial" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ]
    },

    "monospace" :
    {
      size: 11,
      lineHeight : 1.4,
      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
        qx.bom.client.System.WINVISTA ? [ "Consolas", "DejaVu Sans Mono", "Courier New", "monospace" ] :
        [ "Consolas", "DejaVu Sans Mono", "Courier New", "monospace" ]
    }
  }
});