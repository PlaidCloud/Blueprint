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

qx.Theme.define("designer.theme.Font",
{
  extend : qx.theme.modern.Font,

  fonts :
  {
    "default" :
    {
      size : (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? 12 : 11,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "osx") ? [ "Lucida Grande" ] :
        (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? [ "Segoe UI", "Candara" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ]
    },

    "bold" :
    {
      size : (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? 12 : 11,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "osx") ? [ "Lucida Grande" ] :
        (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? [ "Segoe UI", "Candara" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ],
      bold : true
    },

    "small" :
    {
      size : (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? 11 : 10,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "osx") ? [ "Lucida Grande" ] :
        (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? [ "Segoe UI", "Candara" ] :
        [ "Tahoma", "Liberation Sans", "Arial" ]
    },

    "monospace" :
    {
      size: 11,
      lineHeight : 1.4,
      family : (qx.core.Environment.get("os.name") === "osx") ? [ "Lucida Grande" ] :
        (qx.core.Environment.get("os.name") === "win" && qx.core.Environment.get("os.version") === "vista") ? [ "Consolas" ] :
        [ "Consolas", "DejaVu Sans Mono", "Courier New", "monospace" ]
    }
  }
});