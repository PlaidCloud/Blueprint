/* ************************************************************************

Copyright:

License:

Authors:

************************************************************************ */

qx.Theme.define("blueprint.theme.Font",
{
	extend : qx.theme.modern.Font,

	fonts :
	{
	    "monospace" :
	    {
	      size: 11,
	      lineHeight : 1.4,
	      family : qx.bom.client.Platform.MAC ? [ "Lucida Grande" ] :
	        qx.bom.client.System.WINVISTA ? [ "Consolas" ] :
	        [ "Consolas", "DejaVu Sans Mono", "Courier New", "monospace" ]
	    }
	}
});