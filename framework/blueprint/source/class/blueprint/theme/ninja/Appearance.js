/* ************************************************************************

#asset(qx/icon/Tango/16/apps/utilities-calculator.png)

************************************************************************ */

/**
 * The image cell renderer renders image into table cells.
 */
qx.Theme.define("blueprint.theme.ninja.Appearance",
{
  extend : qx.theme.modern.Appearance,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  appearances :
  {
    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */
    "table-header-cell" :
    {
      alias : "atom",
      style : function(states)
      {
        return {
          minWidth  : 5,
          minHeight : 20,
          padding   : states.hovered ? [ 3, 4, 2, 4 ] : [ 3, 4 ],
          decorator : states.hovered ? "table-header-cell-hovered" : "table-header-cell",
          sortIcon  : states.sorted ?
              (states.sortedAscending ? "decoration/table/ascending.png" : "decoration/table/descending.png")
              : undefined
        }
      }
	},
		
    /*
    ---------------------------------------------------------------------------
      CALCULATE FIELD
    ---------------------------------------------------------------------------
    */

    "calculate" : "combobox",

    "calculate/button" :
    {
      alias : "combobox/button",
      include : "combobox/button",

      style : function(states)
      {
        return {
          icon : "icon/16/apps/utilities-calculator.png",
          padding : [0, 3],
          decorator : undefined
        };
      }
    },
    
    "calculate/textfield" :
    {
      style : function(states)
      {
        return {
          padding: [ 2, 4, 1 ]
        }
      }
    },

    "calculate/list" :
    {
      alias : "calculator",
      include : "datechooser",

      style : function(states)
      {
        return {
          decorator : undefined
        }
      }
	},
	
    "calculate/list/operation" :
    {
      alias : "calculator",
      include : "datechooser",

      style : function(states)
      {
        return {
          decorator : undefined
        }
      }
	},
    
    "calculate/list/display" :
    {
      alias : "calculator",
      include : "datechooser",

      style : function(states)
      {
        return {
          decorator : undefined
        }
      }
	},
    
    "calculate/list/label" :
    {
      alias : "calculator",
      include : "datechooser",

      style : function(states)
      {
        return {
          decorator : undefined
        }
      }
    }    
  }
});