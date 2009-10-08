/* ************************************************************************

Tartan Blueprint Designer

    http://www.tartansolutions.com

    Copyright:
      2008 - 2009 Tartan Solutions, Inc

    License:
      LGPL: http://www.gnu.org/licenses/lgpl.html
      EPL: http://www.eclipse.org/org/documents/epl-v10.php
      See the LICENSE file in the project's top-level directory for details.

    Authors:
      * Dan Hummon

************************************************************************ */

qx.Theme.define("designer.theme.Decoration",
{
	extend : qx.theme.modern.Decoration,

	decorations :
	{
	    "invalid" :
	    {
	      decorator : qx.ui.decoration.Beveled,
	
	      style :
	      {
	      	//color: "border-invalid",
	        outerColor : "border-invalid",
	        innerColor : "border-invalid",
	        innerOpacity : 0.5,
	        //backgroundImage : "decoration/form/input.png",
	        //backgroundRepeat : "repeat-x",
	        backgroundColor : "background-invalid"
	        //insets    : [ 4, 8, 8, 4 ]
	      }
	    },
		
		"input-invalid" :
		{
			decorator : qx.ui.decoration.Beveled,

			style :
			{
				outerColor : "red",
				//outerColor : "border-input",
				//innerColor : "red",
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
				baseImage : "designer/decoration/highlight-blue/highlight-blue.png",
				insets    : [ 10, 10, 10, 10 ]
			}
		},
		
		"highlight-green" :
	    {
	      	decorator : qx.ui.decoration.Grid,

			style : {
				baseImage : "designer/decoration/highlight-green/highlight-green.png",
				insets    : [ 10, 10, 10, 10 ]
			}
		},
		
		"highlight-red" :
	    {
	      	decorator : qx.ui.decoration.Grid,

			style : {
				baseImage : "designer/decoration/highlight-red/highlight-red.png",
				insets    : [ 10, 10, 10, 10 ]
			}
		},
		
		"highlight-yellow" :
	    {
	      	decorator : qx.ui.decoration.Grid,

			style : {
				baseImage : "designer/decoration/highlight-yellow/highlight-yellow.png",
				insets    : [ 10, 10, 10, 10 ]
			}
		},
		
		"backgroundGrid" :
		{
			decorator : qx.ui.decoration.Background,

			style :
			{
				backgroundImage : "designer/grid.png",
				backgroundRepeat : "repeat"
			}
		}
	}
});