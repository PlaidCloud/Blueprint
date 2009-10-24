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

qx.Class.define("designer.tree.Tree",
{
	extend  : qx.ui.treevirtual.TreeVirtual,
	include : [qx.ui.treevirtual.MNode],

	/*
	*****************************************************************************
	CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	* @param vData {Object}
	*   The JSON object describing this widget.
	*/
	construct : function(propertyLabel, propertyList, layoutLabel, layoutController, tabView, controllerContainer, layoutPane, securityPane)
	{
		this.base(arguments, "Objects");
		
		this.set({
			width: 250,
			showCellFocusIndicator: false
		});
		
		this.setControllerContainer(controllerContainer);
		this.setLayoutPane(layoutPane);
		this.setSecurityPane(securityPane);
		
		this.setPropertyLabel(propertyLabel);
		this.setPropertyList(propertyList);
		this.setLayoutLabel(layoutLabel);
		this.setLayoutController(layoutController);
		
		propertyList.setObjectTree(this);
		layoutController.setObjectTree(this);
		
		this.setTabView(tabView);
		tabView.setObjectTree(this);
		
		this.setColumnWidth(0, 248);
		this.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		this.setAlwaysShowOpenCloseSymbol(true);
		
		this.setActiveForm(null);
		
		// Set up tab pages.
		
		tabView.setupDesignPage();
		tabView.setupScriptPage(this);
		
		this.setExportArea(tabView.setupSourcePage());
		
		this.addListener("changeSelection", function(e) {
			if (this.getSelectedObject() != undefined && this.getSelectedObject().getMyNode() != e.getData()[0].nodeId) {
				var newObj = this.getMyContainedNodes()[e.getData()[0].nodeId];
				if (newObj != undefined) {
					this.select(newObj);
				}
			}
		}, this);
		
		// Create a new form:
		var layoutObj = {
			"qxSettings": {
				"decorator": "backgroundGrid"
			},
			"constructorSettings": {
				"innerLayout": "qx.ui.layout.Canvas"
			}
		};
		
		this.setActiveForm(new designer.widget.Simple(new blueprint.ui.container.Composite(layoutObj, "new_form")));
	},

	/*
	*****************************************************************************
	PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		activeForm :
		{
			check: "designer.widget.Simple",
			nullable: true,
			apply: "_setActiveForm"
		},
		
		controllerContainer :
		{
			check: "qx.ui.container.Composite",
			nullable: false
		},		
		
		layoutPane :
		{
			check: "qx.ui.splitpane.Pane",
			nullable: false
		},
		
		securityPane :
		{
			check: "qx.ui.splitpane.Pane",
			nullable: false
		},		
		
		
		tabView :
		{
			check: "designer.TabView",
			nullable: false
		},
		
		propertyLabel :
		{
			check: "qx.ui.basic.Label",
			nullable: false
		},
		
		propertyList :
		{
			check: "designer.list.List",
			nullable: false
		},
		
		layoutLabel :
		{
			check: "qx.ui.basic.Label",
			nullable: false
		},
		
		treeRoot :
		{
			check: "Integer",
			nullable: true
		},
		
		selectedObject :
		{
			check: "Object",
			nullable: true,
			init: null
		},
		
		myContainedNodes :
		{
			check: "Array",
			init: []
		},
		
		myNodesToJson :
		{
			check: "Array",
			init: []
		},
		
		exportArea :
		{
			check: "designer.controller.Source"
		},
		
		layoutController :
		{
			check: "designer.controller.Layout"
		},
		
		formSecurityController :
		{
			check: "designer.controller.FormSecurity"
		},
		
		componentSecurityController :
		{
			check: "designer.controller.ComponentSecurity"
		},
		
		enableSelections :
		{
			check: "Boolean",
			init: true
		},
		
		blueprintScripts :
		{
		    check: "Object"
		},
		
		blueprintFunctions :
		{
		    check: "Object"
		}
	},
	
	
	/*
	*****************************************************************************
	MEMBERS
	*****************************************************************************
	*/

	members :
	{
		_setActiveForm : function(value, old)
		{
			if (this.getTreeRoot() != null) {
				this.getDataModel().prune(this.getTreeRoot(), true);
				this.getDataModel().setData();
			}
				
			this.setMyContainedNodes(new Array());
			this.setMyNodesToJson(new Array());
			this.setBlueprintScripts(new Object());
			
			
			this.setBlueprintFunctions(new Object());
			this.select(null);
			this.setTreeRoot(null);
				
			this.setEnabled(false);
			
			if (old != null) { this.getTabView().getDesignArea().remove(old); }
			if (old != null && value == null) { this.setActiveForm(null); }
			
			if (value != null) {
				this.setEnabled(true);
				
				var tree_root = this.getDataModel().addBranch(null, "Top Container", true);
				this.setTreeRoot(tree_root);
				this.getDataModel().setData();
				
				value.setObjectTree(this);
				value.setMyNode(tree_root);
				this.getMyContainedNodes()[tree_root] = value;
				this.getTabView().getDesignArea().add(value, {top:0, left:0, right:0, bottom:0});
				this.setActiveForm(value);
			}
		},
		
		addTreeNode : function(parent, child, event, layoutMap)
		{
			try {
				if (event != null) {
					if (typeof parent.getTargetControl().getLayout == "function") {
						if (parent.getTargetControl().getLayout() instanceof qx.ui.layout.Canvas) {
							parent.add(child, {top: event.getDocumentTop() - parent.getContainerLocation().top - 10, left: event.getDocumentLeft() - parent.getContainerLocation().left - 10});
						}

						if (parent.getTargetControl().getLayout() instanceof qx.ui.layout.Dock) {
							var myWidth = parseInt((parent.getContainerLocation().right - parent.getContainerLocation().left) * 0.2);
							var myHeight = parseInt((parent.getContainerLocation().bottom - parent.getContainerLocation().top) * 0.2);
							
							var targetEdge = "center";
							
							if (event.getDocumentLeft() < (parent.getContainerLocation().left + myWidth)) { targetEdge = "west"; }
							if (event.getDocumentLeft() > (parent.getContainerLocation().right - myWidth)) { targetEdge = "east"; }
							
							if (event.getDocumentTop() < (parent.getContainerLocation().top + myHeight)) { targetEdge = "north"; }
							if (event.getDocumentTop() > (parent.getContainerLocation().bottom - myHeight)) { targetEdge = "south"; }
							
							parent.add(child, {edge: targetEdge});
						}
					} else {
						this.debug('Layout is undefined');
						parent.add(child);
					}
				} else {
					parent.add(child, layoutMap);
				}
			} catch (e) {
				alert('Error adding object: ' + e);
				return;
			}
			
			var new_node = this.getDataModel().addBranch(parent.getMyNode(), child.getTargetControl().classname, false);
			child.setObjectTree(this);
			child.setMyNode(new_node);
			
			this.getMyContainedNodes()[new_node] = child;
			this.getDataModel().setData();
			
			this.select(child);
		},
		
		removeTreeNode : function(element)
		{
			this.getDataModel().prune(element.getMyNode(), true);
			this.getMyContainedNodes()[element.getMyNode()] = null;
			this.getDataModel().setData();
			
			element.getLayoutParent().remove(element);
			
			element.dispose();
			this.select(null);
		},
		
		select : function(child)
		{
			if (this.getEnableSelections()) {
				if (child != this.getSelectedObject() && child != null) {
					this.setSelectedObject(child);
					this.getPropertyLabel().setValue(child.getTargetControl().classname + " Properties:");
					this.getLayoutLabel().setValue(child.getTargetControl().classname + " Layout Properties:");

					var targetNode = this.__findNodePosition(child.getMyNode());

					this.__openParents(targetNode);
				}
				if (child != null) {
					this.getPropertyList().updateSelection(child);
					this.getLayoutController().updateSelection(child);
				} else {
					this.setSelectedObject(null);
					this.getPropertyLabel().setValue(" Properties:");
					this.getLayoutLabel().setValue(" Layout Properties:");

					this.getPropertyList().cancelEditing();

					var propData = new Array();
					this.getPropertyList().getTableModel().setData(propData);

					this.getLayoutController().enableControls(false);
				}
			}
		},
		
		exportToPlayground : function()
		{
		    var jsonObject = this.__getJsonForNode(this.getTreeRoot(), this.getDataModel().getData());
		    jsonObject["object"]["objectClass"] = "blueprint.ui.container.Composite";
			jsonObject["object"]["type"] = "top_container";
			jsonObject["object"]["qxSettings"]["decorator"] = null;
			
			jsonObject["object"]["blueprintScripts"] = this.getBlueprintScripts();
			
		    var jsonString = qx.util.Json.stringify(jsonObject["object"], true);
		    
		    // Source version:
		    self.location = "../../playground/source/index.html#" + escape('{"code": ' + '"' + encodeURIComponent(jsonString) + '"}');
		    // Build version:
		    // self.location = "../playground/index.html#" + escape('{"code": ' + '"' + encodeURIComponent(jsonString) + '"}');
		},
		
		exportJson : function()
		{
			if (this.getActiveForm() != null) {
				this.setEnableSelections(false);
				var treeData = this.getDataModel().getData();

				var jsonObject = this.__getJsonForNode(this.getTreeRoot(), treeData);

				jsonObject["object"]["objectClass"] = "blueprint.ui.window.Window";
				jsonObject["object"]["type"] = "top_container";
				jsonObject["object"]["qxSettings"]["decorator"] = null;
				
				jsonObject["object"]["blueprintScripts"] = this.getBlueprintScripts();
				
				this.getExportArea().setValue(qx.util.Json.stringify(jsonObject["object"], true));
				this.getExportArea().setLastKnownGood(qx.util.Json.stringify(jsonObject["object"], true));
				this.setEnableSelections(true);
			}
		},
		
		importJson : function(jsonObject)
		{
			this.setEnableSelections(false);
			if (jsonObject["objectClass"] == "blueprint.ui.window.Window" && jsonObject["type"] == "top_container") {
				var layoutObj = {
					"qxSettings": {
						"decorator": "backgroundGrid"
					},
					"constructorSettings": jsonObject["constructorSettings"]
				};
				
				var top_form = new designer.widget.Simple(new blueprint.ui.container.Composite(layoutObj, "new_form"));
				
				this.setActiveForm(top_form);
				if (jsonObject.contents != undefined && jsonObject.contents.length > 0) {
					this.__importJsonWorker(top_form, jsonObject);
				}
			}
			this.setEnableSelections(true);
		},
		
		saveBlueprintScript : function(scriptName, scriptText)
		{
		    var scripts = this.getBlueprintScripts();
		    
		    scripts[scriptName] = scriptText;
		    
		    this.setBlueprintScripts(scripts);
		},
		
		__importJsonWorker : function(parent, importJson)
		{
			if (importJson.contents != undefined && importJson.contents.length > 0) {
				for (var i=0;i<importJson.contents.length;i++) {
					this.debug('building ' + importJson.contents[i].object.objectClass);
					var newItem = new designer.widget.Mutable(blueprint.Manager.getInstance().generate(importJson.contents[i].object, "new_form", true));
					// Register the object's name.
					if (importJson.contents[i].object.objectId != undefined && importJson.contents[i].object.objectId != '') {
						blueprint.util.Registry.getInstance().set("new_form", importJson.contents[i].object.objectId, newItem.getTargetControl());
					}

					this.addTreeNode(parent, newItem, null, importJson.contents[i].layoutmap);

					if (importJson.contents != undefined && importJson.contents.length > 0) {
						this.__importJsonWorker(newItem, importJson.contents[i].object);
					}
				}
			} else {
				//Nothing in this object.
			}
		},
		
		__getJsonForNode : function(nodeId, treeData)
		{
			var layoutProps = this.getMyContainedNodes()[nodeId].getLayoutProperties();
			if (layoutProps.top != undefined) { layoutProps.top = layoutProps.top + this.getMyContainedNodes()[nodeId].getWidgetPadding(); }
			if (layoutProps.right != undefined) { layoutProps.right = layoutProps.right - this.getMyContainedNodes()[nodeId].getWidgetPadding(); }
			if (layoutProps.bottom != undefined) { layoutProps.bottom = layoutProps.bottom - this.getMyContainedNodes()[nodeId].getWidgetPadding(); }
			if (layoutProps.left != undefined) { layoutProps.left = layoutProps.left + this.getMyContainedNodes()[nodeId].getWidgetPadding(); }
			
			var jsonObj = {
				"layoutmap": layoutProps,
				"object": {
	            	"objectClass": this.getMyContainedNodes()[nodeId].getTargetControl().classname,
	            	"objectId": "",
					"type": "unknown",
	            	"qxSettings": this.__getJsonProperties(this.getMyContainedNodes()[nodeId]),
	            	"constructorSettings": {}
	        	}
			};
			
			if (this.getMyContainedNodes()[nodeId].getTargetControl() instanceof blueprint.ui.container.Composite) {
				jsonObj["object"]["type"] = "container";
				jsonObj["object"]["constructorSettings"]["innerLayout"] = this.getMyContainedNodes()[nodeId].getTargetControl().getLayout().classname;
				jsonObj["object"]["contents"] = new Array();
				for(var i=0;i<treeData[nodeId].children.length;i++) {
					jsonObj["object"]["contents"].push(this.__getJsonForNode(treeData[nodeId].children[i], treeData));
				}
			} else {
				jsonObj["object"]["type"] = "object";
			}
			
			return jsonObj;
		},
		
		__getJsonProperties : function(obj)
		{
			var allowedTypes = ["Number", "Integer", "String", "Boolean", "Decorator"];
			
			var getObject = new Object();
			var getArray = qx.Class.getProperties(qx.Class.getByName(obj.getTargetControl().classname));
			for (var i=0;i<getArray.length;i++) {
				var type = qx.Class.getPropertyDefinition(qx.Class.getByName(obj.getTargetControl().classname), getArray[i]).check;
				if (qx.lang.Array.contains(allowedTypes, type) && obj.getTargetControl().get(getArray[i]) != null) {
				    
				    if (getArray[i] == "enabled") {
				        
				    } else if (getArray[i] == "zIndex") {
				        
				    } else if (qx.Class.getPropertyDefinition(qx.Class.getByName(obj.getTargetControl().classname), getArray[i]).init == obj.getTargetControl().get(getArray[i])) {
				        // Property is set to default -- do not include it.
				    } else {
				        getObject[getArray[i]] = obj.getTargetControl().get(getArray[i]);
				    }
				}
			}
			return getObject;
		},
		
		__findNodePosition : function(findMe)
		{
			var nodeArr = this.getDataModel().getData();
			var targetNode = -1;
			
			if (findMe == nodeArr[findMe].nodeId) {
				targetNode = findMe;
			} else {
				this.warn('node location shortcut failed.');
				for (var i=0;i<nodeArr.length;i++) {
					if (findMe == nodeArr[i].nodeId) {
						targetNode = i;
						break;
					}
				}
			}
			return targetNode;
		},
		
		__openParents : function(nodeId)
		{
			var nodeArr = this.getDataModel().getData();
			var parentArr = new Array();
			parentArr.push(nodeId);
			
			this.__openParentsWorker(nodeArr, parentArr);
			
			for (var i=parentArr.length-1;i>=0;i--) {
				this.nodeSetOpened(parentArr[i], true);
			}
			
			var row = this.getDataModel().getNodeRowMap()[parentArr[0]];
			this.getSelectionModel().addSelectionInterval(row, row);
			
		},
		
		__openParentsWorker : function(nodeArr, parentArr)
		{
			var parentNodeId = nodeArr[parentArr[parentArr.length-1]].parentNodeId;
			parentArr.push(this.__findNodePosition(parentNodeId));
			if (parentNodeId > 1) {
				this.__openParentsWorker(nodeArr, parentArr);
			}
		},
		
		showDesign : function()
		{
			this.setEnableSelections(false);
			this.__removeAllExcept("design");

			var children = this.getControllerContainer().getChildren();
			if (!qx.lang.Array.contains(children, this.getLayoutPane())) {
				this.getControllerContainer().add(this.getLayoutPane());
			}
			this.setEnableSelections(true);
		},
		
		showSecurity : function()
		{
			this.setEnableSelections(false);
			this.__removeAllExcept("security");

			var children = this.getControllerContainer().getChildren();
			if (!qx.lang.Array.contains(children, this.getSecurityPane())) {
				this.getControllerContainer().add(this.getSecurityPane());
			}
			
			this.setEnableSelections(true);
		},
		
		showSource : function()
		{
			this.setEnableSelections(false);
			this.__removeAllExcept("source");
			
			this.exportJson();
			this.getExportArea().show();
			this.setEnableSelections(true);
		},
		
		showScript : function()
		{
			//this.setEnableSelections(false);
			
			//this.setEnableSelections(true);
		},
		
		showFunction : function()
		{
			//this.setEnableSelections(false);
			
			//this.setEnableSelections(true);
		},
		
		__removeAllExcept : function(exception)
		{
		    if (exception != "design") { this.__removeDesign(); }
			if (exception != "security") { this.__removeSecurity(); }
			if (exception != "source") { this.__removeSource(); }
			//if (exception != "script") { this.__removeScript(); }
			//if (exception != "function") { this.__removeFunction(); }
		},
		
		__removeDesign : function()
		{
			var children = this.getControllerContainer().getChildren();
			if (qx.lang.Array.contains(children, this.getLayoutPane())) {
				this.getControllerContainer().remove(this.getLayoutPane());
			}
		},
		
		__removeSecurity : function()
		{
			var children = this.getControllerContainer().getChildren();
			if (qx.lang.Array.contains(children, this.getSecurityPane())) {
				this.getControllerContainer().remove(this.getSecurityPane());
			}
		},
		
		__removeSource : function()
		{
			try {
				if (this.getExportArea().getValue() != "" && this.getExportArea().getValue() != this.getExportArea().getLastKnownGood()){
				    alert(this.getExportArea().getValue());
					this.importJson(qx.util.Json.parse(this.getExportArea().getValue()));
				}
			} catch(e) {
				alert('Json Parsing Failed: ' + e);
				this.importJson(qx.util.Json.parse(this.getExportArea().getLastKnownGood()));
			}
			this.getExportArea().hide();
		},
		
		__removeScript : function()
		{
			
		},
		
		__removeFunction : function()
		{
			
		}
	},

	/*
	*****************************************************************************
	DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{

	}
});