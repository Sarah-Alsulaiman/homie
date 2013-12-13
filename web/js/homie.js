
//-----------------------------------------------------------------------------------------
// Global Level variables                                                                   
//------------------------------------------------------------------------------------------
    var MAX_LEVEL = 7;
    var MIN_LEVEL = 1;
    var CURRENT_LEVEL = getLevel();
    var LEVELS_MSG = ["<br>In general, a home consist of wall, roof, door, and windows. Can you build a home using these blocks<br><br>",
                        "<br>Can you to build a house with different colors and switch the lights on? <br><br>",
                        "<br>Can you program a house so that when it is daytime, the lights are switched off and when it is night time, it will be switched on?",
                        "<br>Now, you can build a house with your favorite colors and give it a name so that you can build it faster anytime later!",
                        "<br>Can you build a house so that when the city is Riyadh, your favorite house will be built, otherwise, a different house will be built",
                        "<br>A flashing house will keep turning on and off the lights over and over again.<br> Can you build a flashing house that will keep turning the lights on and off 4 times?",
                       	"<br>Now, you can play with the blocks as you like!",
                       ];
   
    var COLORS = ['red', 'blue'];
    var playing = false;
    var error = '';
    
    var xml_text = '<xml> </xml>';
    var compare_procedure = '';
    
    var CONNECTION_ID;
    
    var tipImg;
    var originalRoof;
    var originalDoor;
    var originalWall;
    var originalWindows;
    var originalLights;
    var originalZindex;
    
    var tempImg;
    var Zindex = 4;
    var CURRENT_BG = 'blank';
    
    var dafault_procedure = false;
//-----------------------------------------------------------------------------------------
// store procedures in session storage	                                                                 
//------------------------------------------------------------------------------------------  
    
    function storeProcedure () {
    
    	var saved_procedure = '';
    	
    	var current_xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    	curret_xml_text = Blockly.Xml.domToText(current_xml);
    	
    	xmlDoc = loadXMLString(curret_xml_text);
    	
    	x = xmlDoc.getElementsByTagName('block');
    	for (i=0; i < x.length; i++) {
  			if (x[i].parentNode.nodeName == 'xml') {
  				att = x.item(i).attributes.getNamedItem("type");
  				if ( att.value == 'procedures_defnoreturn') {
  					cloneNode=x[i].cloneNode(true);
  					saved_procedure += Blockly.Xml.domToText(cloneNode);
  					saved_procedure += "#";
  				}
  			}
  	}
  		
  		sessionStorage.procedure = saved_procedure;
    }
	
	  
//------------------------------------------------------------------------------------------
//  Add Event Listener
//------------------------------------------------------------------------------------------
    
    window.addEventListener("message", processEvent, false);
    
//---------------------------------------------------------------------------
//  Get level number from URL
//---------------------------------------------------------------------------
    function getLevel () {
      var val = window.location.search.match(new RegExp('[?&]level=(\\d+)'));
      val = val ? val[1] : MIN_LEVEL;
      val = Math.min(Math.max(MIN_LEVEL, val), MAX_LEVEL);
      return val;
    }
    
//---------------------------------------------------------------------------
// Redirect to the next level
//---------------------------------------------------------------------------
    function advanceLevel () {
		storeProcedure();
		if (CURRENT_LEVEL < MAX_LEVEL - 1) {
		    $.jqDialog.confirm("Wonderful! Now you have more options to use inside the menues!<BR/> <BR/>Would you like to continue? ".replace('%1', CURRENT_LEVEL + 1),
		    function() { window.location = window.location.protocol + '//' +
	                     window.location.host + window.location.pathname +
	                     '?level=' + (CURRENT_LEVEL + 1); },    // callback function for 'YES' button
	        
		    function() {  }    // callback function for 'NO' button
		    );  
		}
	      
		else if (CURRENT_LEVEL == MAX_LEVEL - 1) {
		    $.jqDialog.alert("<center> Congratulations! <br> You finished all activities <br> <br>Now, you can play with all blocks as you like</center>", 
	            function() { window.location = window.location.protocol + '//' + window.location.host + window.location.pathname + '?level=' + (CURRENT_LEVEL + 1);  }); // callback function for 'OK' button
		}   
    }
 
 

//---------------------------------------------------------------------------
// Show error message
//---------------------------------------------------------------------------
    function showError () {
	
	$.jqDialog.alert("Are you missing something?<br><br>" + error, function() { }); // callback function for 'OK' button
      
    }
 
//---------------------------------------------------------------------------
// Populate images
//---------------------------------------------------------------------------
    function populate() {
	var COLORS = ['red', 'blue'];
        for (var j=0; j < COLORS.length; j++ ) {
            var imgR=document.createElement("img");
            imgR.src = 'images/roof-' + COLORS[j] +'.png';
            imgR.id = 'roof-'+ COLORS[j];
            imgR.className = 'roof';
            document.getElementById("images").appendChild(imgR);
                          
            var imgW= document.createElement("img");
            imgW.src = 'images/wall-' + COLORS[j] +'.png';
            imgW.id = 'wall-' + COLORS[j];
            imgW.className = 'wall';
            document.getElementById("images").appendChild(imgW);
                          
            var imgD= document.createElement("img");
            imgD.src = 'images/door-' + COLORS[j] +'.png';
            imgD.id = 'door-' + COLORS[j];
            imgD.className = 'door';
            document.getElementById("images").appendChild(imgD);
     
            var imgW1= document.createElement("img");
            imgW1.src = 'images/windows-' + COLORS[j] +'.png';
            imgW1.id = 'windows-' + COLORS[j];
            imgW1.className = 'windows';
            document.getElementById("images").appendChild(imgW1);
            //console.log(img.src);
                         
          
        }
        
        var imgL1= document.createElement("img");
        imgL1.src = 'images/lights-on.png';
        imgL1.id = 'lights-on';
        imgL1.className = 'lights';
        document.getElementById("images").appendChild(imgL1);
        
        var imgL2= document.createElement("img");
        imgL2.src = 'images/lights-off.png';
        imgL2.id = 'lights-off';
        imgL2.className = 'lights';
        document.getElementById("images").appendChild(imgL2);
                      
    }        
    	
//---------------------------------------------------------------------------------------
// Utility functions                                                                                   
//---------------------------------------------------------------------------------------
	
    function setHtmlVisibility(id, visible) {
		var el = document.getElementById(String(id));
		var item = id.split("-");
		switch (item[0]) {
			case 'roof':
				originalRoof = id;
				break;
				
			case 'wall':
				originalWall = id;
				break;
				
			case 'windows':
				originalWindows = id;
				break;
				
			case 'door':
				originalDoor = id;
				break;
			
			case 'lights':
				originalLights = id;
				break;
				
			default:
				item[0] = 'background';
				break;
			
		}
		
		hideVariations(item[0]);
                
        if (el) {
      		if (item[0] != "background") {
	      		el.style.visibility = visible ? "visible" : "hidden";
	      		el.style.zIndex = Zindex++;
      		}
      		else {
      			var bg = document.getElementById("rosie-output");
      			bg.style.background = "url(\'images//" + id + ".png\')";
      			CURRENT_BG = id;
      		}
      	}
                        
                             
   }
   	
   	
    function hideVariations (variation) {
	   	if (variation == "roof" || variation == "wall" || variation == "door" || variation == "windows") {
		    for (var j=0; j < COLORS.length; j++) {
				var item = variation.concat("-",COLORS[j].toString());
		    	item = document.getElementById(item);
	            item.style.visibility = "hidden";
		        		
		    }
		  			 
		}
	   		
	    else if (variation == "lights") {
	    	var item = variation.concat("-", "on");
	    	item = document.getElementById(item);
	        item.style.visibility = "hidden";
	        
	        var item2 = variation.concat("-","off");
	        item2 = document.getElementById(item2);
	        item2.style.visibility = "hidden";
	    	
	    
	    }
		
    }
   
   
    function hideAll() {
    
    	hideVariations("roof");
    	hideVariations("wall");
    	hideVariations("door");
    	hideVariations("windows");
    	hideVariations("lights");
   
    }
    
	function setHtmlOpacity(id, opacity) {
		var el = document.getElementById(id);
      	if (el) {
      		if (opacity > 0) {
      			el.style.zIndex = 100;
         	} else {
            	el.style.zIndex = -1; }
        el.style.opacity = opacity;
      	}
   	}
    
    
    function fadeOutAfterDelay(id, delay) {
      window.setTimeout(function() { setHtmlOpacity(id, 0.0); }, delay);
    }
     
    function hideText() {
      document.getElementById('full_text_div').style.display='none';
      document.getElementById('more_btn').style.display='none';
      document.getElementById('part_text_div').style.display='inline';
    }
    
    function showText() {
      document.getElementById('more_btn').style.display='inline';
      document.getElementById('full_text_div').style.display='inline';
      document.getElementById('part_text_div').style.display='none';
    }    
   
//---------------------------------------------------------------------------
// Process dart event
//---------------------------------------------------------------------------
	
    function processEvent(event) {
    	var event = event.data;
      	var check = event.substring(0,8);
      	
      	if ( check == "@blockly" ) {
      		//console.log("HTML received message from dart " + event);
      		
      		var parts = event.split('#');
      	
      		if (parts[1].substring(0, 6) == "error ") {
      			playing = false;
      			error = parts[1].substring(6);
      			showError();
	      	}
	      	
	      	else if (parts[1] == "DONE!") {
	        	playing = false;
	        	window.setTimeout(function() { advanceLevel(); }, 500);
	      	}
	      	
	      	else if (parts[1].substring(0, 3) == "bg ") {  //received bg to display
	      		var bg = parts[1].substring(3);
	      		//console.log("HTML received message from dart for background " + bg);
		      	setHtmlVisibility(bg, true);
	      	}
	      	
	      	else if (parts[1].substring(0,7) == "outfit "){		// received an outfit to display
	      		//console.log("HTML received message from dart for block " + event);
		      	var outfit = parts[1].substring(7);
		      	setHtmlVisibility(outfit, true);
		      
	      	}
      }	
    }   
//---------------------------------------------------------------------------------------
//  Check if blocks are connected (procedures are special case)                                                                               
//---------------------------------------------------------------------------------------
	function checkConnections(code) {
      var connected = true;
      var start = 0;
      var newLine = 0;
      var length = code.length;
      var amount = 0;
      while (start < code.length && start != -1) {
        newLine = code.indexOf("\n",start);
        var curlyBrace = code.indexOf("}" ,start);
        
        if ( newLine > 0 ) {
        	if ( curlyBrace > 0) {
        		if ( newLine -1 != curlyBrace ) {
            		connected = false;
            		break;
          		}
          		else { start = newLine+3; amount += (curlyBrace - amount) ; length -= Math.abs(amount) } //++ for multiple procedures...
        	}
        	else { connected = false; break; } ///++++++
      	}
      	else { break; } 
      }
      
      return connected;
    }
    
//---------------------------------------------------------------------------------------
//  Send the generated Javascript code to dart for processing                                                                                  
//---------------------------------------------------------------------------------------
	function sendBlocklyCode() {
      if (!playing) {
        var code = Blockly.Generator.workspaceToCode('JavaScript');
        //alert(code);
        //--------------------------------------------------
        // error 1: no blocks on the screen
        //--------------------------------------------------
        if (code.length == 0) {
          setHtmlOpacity("hint1", 1.0);
          fadeOutAfterDelay("hint1", 5000);
        }
        
        else {
          var connected = checkConnections(code);
          
          //--------------------------------------------------
          // error 2: blocks aren't connected
          //--------------------------------------------------
          if (!connected) {
            setHtmlOpacity("hint2", 1.0);
            fadeOutAfterDelay("hint2", 5000);
          }
          
          else {
          
            code = code.replace(/\]\[/g, '], [');
            code = (code.replace(/\)/g, '')).replace(/\(/g, '');
            code = code.replace(/\;/g, '');
           
            hideAll();
             
            code = '@dart'+ CURRENT_LEVEL + '#' + code;
            var origin = window.location.protocol + "//" + window.location.host;
   			window.postMessage(code, origin);
   			
            tempImg = '';
            playing = true;
            if (CURRENT_BG != 'blank') {
              	var bg = document.getElementById("rosie-output");		
      			bg.style.background = "url(\'images//blank.png\')";
            }
          }
        }
      
      }
      
      else {
      	alert("still generating previous house");
      
      }
    }
    
    
//----------------------------------------------------------------------------------------
// Inject blockly to this page and display the message corrosponding to the current level
// Blockly redefined functions
//----------------------------------------------------------------------------------------
	function inject() {     populate();
	
		//Blockly.Workspace.traceOn = true;
      //***********************************************************************************************
      Blockly.makeColour = function(hue, sat, val) {
		  return goog.color.hsvToHex(hue, sat,
		      val * 256);
		};
      //***********************************************************************************************
      Blockly.Block.prototype.setColour = function(colourHue, colourSat, colourVal) {
		  this.colourHue_ = colourHue;
		  this.colourSat_ = colourSat;
		  this.colourVal_ = colourVal;
		  
		  if (this.svg_) {
		    this.svg_.updateColour();
		  }
		  if (this.mutator) {
		    this.mutator.updateColour();
		  }
		  if (this.comment) {
		    this.comment.updateColour();
		  }
		  if (this.warning) {
		    this.warning.updateColour();
		  }
		  if (this.rendered) {
		    // Bump every dropdown to change its colour.
		    for (var x = 0, input; input = this.inputList[x]; x++) {
		      for (var y = 0, title; title = input.titleRow[y]; y++) {
		        title.setText(null);
		      }
		    }
		    this.render();
		  }
		};
		
		//***********************************************************************************************
		/**
		 * Change the colour of a block.
		 */
		Blockly.BlockSvg.prototype.updateColour = function() {
		  var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
		  var rgb = goog.color.hexToRgb(hexColour);
		  var rgbLight = goog.color.lighten(rgb, 0.3);
		  var rgbDark = goog.color.darken(rgb, 0.4);
		  this.svgPathLight_.setAttribute('stroke', goog.color.rgbArrayToHex(rgbLight));
		  this.svgPathDark_.setAttribute('fill', goog.color.rgbArrayToHex(rgbDark));
		  this.svgPath_.setAttribute('fill', hexColour);
		};
		//************************************************************************************************
		Blockly.Block.prototype.getColourH = function() {
		  return this.colourHue_;
		};
		//************************************************************************************************
		Blockly.Block.prototype.getColourS = function() {
		  return this.colourSat_;
		};
		//*************************************************************************************************
		Blockly.Block.prototype.getColourV = function() {
		  return this.colourVal_;
		};
		//*************************************************************************************************
      
	       Blockly.FieldDropdown.prototype.showEditor_ = function() {
		  var svgGroup = Blockly.FieldDropdown.svgGroup_;
		  var svgOptions = Blockly.FieldDropdown.svgOptions_;
		  var svgBackground = Blockly.FieldDropdown.svgBackground_;
		  var svgShadow = Blockly.FieldDropdown.svgShadow_;
		  // Erase all existing options.
		  goog.dom.removeChildren(svgOptions);
		  // The menu must be made visible early since otherwise BBox and
		  // getComputedTextLength will return 0.
		  Blockly.removeClass_(svgGroup, 'blocklyHidden');
		  Blockly.FieldDropdown.openDropdown_ = this;
		
		  function callbackFactory(value) {
		    return function(e) {
		      if (this.changeHandler_) {
		        // Call any change handler, and allow it to override.
		        var override = this.changeHandler_(value);
		        if (override !== undefined) {
		          value = override;
		        }
		      }
		      if (value !== null) {
		        this.setValue(value);
		      }
		      // This mouse click has been handled, don't bubble up to document.
		      e.stopPropagation();
		    };
		  }
		
		  var maxWidth = 0;
		  var resizeList = [];
		  var checkElement = null;
		  var options = this.getOptions_();
		  for (var x = 0; x < options.length; x++) {
		    var text = options[x][0];  // Human-readable text.
		    var value = options[x][1]; // Language-neutral value.
		    var gElement = Blockly.ContextMenu.optionToDom(text);
		    var rectElement = /** @type {SVGRectElement} */ (gElement.firstChild);
		    var textElement = /** @type {SVGTextElement} */ (gElement.lastChild);
		    svgOptions.appendChild(gElement);
		    // Add a checkmark next to the current item.
		    if (!checkElement && value == this.value_) {
		      checkElement = Blockly.createSvgElement('text',
		          {'class': 'blocklyMenuText', 'y': 15}, null);
		      // Insert the checkmark between the rect and text, thus preserving the
		      // ability to reference them as firstChild and lastChild respectively.
		      gElement.insertBefore(checkElement, textElement);
		      checkElement.appendChild(document.createTextNode('\u2713'));
		    }
		
		    gElement.setAttribute('transform',
		        'translate(0, ' + (x * Blockly.ContextMenu.Y_HEIGHT) + ')');
		    resizeList.push(rectElement);
		    Blockly.bindEvent_(gElement, 'mousedown', null, Blockly.noEvent);
		    Blockly.bindEvent_(gElement, 'mouseup', this, callbackFactory(value));
		    Blockly.bindEvent_(gElement, 'mouseup', null,
		                       Blockly.FieldDropdown.hide);
		    // Compute the length of the longest text length.
		    maxWidth = Math.max(maxWidth, textElement.getComputedTextLength());
		  }
		  // Run a second pass to resize all options to the required width.
		  maxWidth += Blockly.ContextMenu.X_PADDING * 2;
		  for (var x = 0; x < resizeList.length; x++) {
		    resizeList[x].setAttribute('width', maxWidth);
		  }
		  if (Blockly.RTL) {
		    // Right-align the text.
		    for (var x = 0, gElement; gElement = svgOptions.childNodes[x]; x++) {
		      var textElement = gElement.lastChild;
		      textElement.setAttribute('text-anchor', 'end');
		      textElement.setAttribute('x', maxWidth - Blockly.ContextMenu.X_PADDING);
		    }
		  }
		  if (checkElement) {
		    if (Blockly.RTL) {
		      // Research indicates that RTL checkmarks are supposed to be drawn the
		      // same in the same direction as LTR checkmarks.  It's only the alignment
		      // that needs to change.
		      checkElement.setAttribute('text-anchor', 'end');
		      checkElement.setAttribute('x', maxWidth - 5);
		    } else {
		      checkElement.setAttribute('x', 5);
		    }
		  }
		  var width = maxWidth + Blockly.FieldDropdown.CORNER_RADIUS * 2;
		  var height = options.length * Blockly.ContextMenu.Y_HEIGHT +
		               Blockly.FieldDropdown.CORNER_RADIUS + 1;
		  svgShadow.setAttribute('width', width);
		  svgShadow.setAttribute('height', height);
		  svgBackground.setAttribute('width', width);
		  svgBackground.setAttribute('height', height);
		  //var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
		  var hexColour = Blockly.makeColour(this.sourceBlock_.getColourH(), this.sourceBlock_.getColourS(), this.sourceBlock_.getColourV());
		  svgBackground.setAttribute('fill', hexColour);
		  // Position the dropdown to line up with the field.
		  var xy = Blockly.getSvgXY_(/** @type {!Element} */ (this.borderRect_));
		  var borderBBox = this.borderRect_.getBBox();
		  var x;
		  if (Blockly.RTL) {
		    x = xy.x - maxWidth + Blockly.ContextMenu.X_PADDING + borderBBox.width -
		        Blockly.BlockSvg.SEP_SPACE_X / 2;
		  } else {
		    x = xy.x - Blockly.ContextMenu.X_PADDING + Blockly.BlockSvg.SEP_SPACE_X / 2;
		  }
		  svgGroup.setAttribute('transform',
		      'translate(' + x + ', ' + (xy.y + borderBBox.height) + ')');
		};
	       //**********************************************************************************************************************
	      
	      
	      Blockly.FieldDropdown.prototype.setText = function(text) {
	  if (this.sourceBlock_) {
	    // Update arrow's colour.
	     //var hexColour = Blockly.makeColour(this.block_.getColourH(), this.block_.getColourS(), this.block_.getColourV());
	    this.arrow_.style.fill = Blockly.makeColour(this.sourceBlock_.getColourH(), this.sourceBlock_.getColourS(), this.sourceBlock_.getColourV());
	  }
	  if (text === null) {
	    // No change if null.
	    return;
	  }
	  this.text_ = text;
	  // Empty the text element.
	  goog.dom.removeChildren(/** @type {!Element} */ (this.textElement_));
	  // Replace whitespace with non-breaking spaces so the text doesn't collapse.
	  text = text.replace(/\s/g, Blockly.Field.NBSP);
	  if (!text) {
	    // Prevent the field from disappearing if empty.
	    text = Blockly.Field.NBSP;
	  }
	  var textNode = document.createTextNode(text);
	  this.textElement_.appendChild(textNode);
	
	  // Insert dropdown arrow.
	  if (Blockly.RTL) {
	    this.textElement_.insertBefore(this.arrow_, this.textElement_.firstChild);
	  } else {
	    this.textElement_.appendChild(this.arrow_);
	  }
	
	  // Cached width is obsolete.  Clear it.
	  this.size_.width = 0;
	
	  if (this.sourceBlock_ && this.sourceBlock_.rendered) {
	    this.sourceBlock_.render();
	    this.sourceBlock_.bumpNeighbours_();
	    this.sourceBlock_.workspace.fireChangeEvent();
	  }
	};
      
      //***********************************************************************************************************************
     
     
/**
 * Ensure two identically-named procedures don't exist.
 * @param {string} name Proposed procedure name.
 * @param {!Blockly.Block} block Block to disambiguate.
 * @return {string} Non-colliding name.
 */
Blockly.Procedures.findLegalName = function(name, block) {
  if (block.isInFlyout) {
    // Flyouts can have multiple procedures called 'procedure'.
    return name;
  }
  while (!Blockly.Procedures.isLegalName(name, block.workspace, block)) {
    // Collision with another procedure.
    var r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      if (default_procedure) { name+= 'name'; default_procedure = false;}
      name += '1';
    } else {
      name = r[1] + (parseInt(r[2], 10) + 1);
    }
  }
  return name;
};
      
      
      /**
 * Does this procedure have a legal name?  Illegal names include names of
 * procedures already defined.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 */
Blockly.Procedures.isLegalName = function(name, workspace, opt_exclude) {
	if (name === "") { default_procedure = true; return false;}
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var x = 0; x < blocks.length; x++) {
    if (blocks[x] == opt_exclude) {
      continue;
    }
    var func = blocks[x].getProcedureDef;
    if (func) {
      var procName = func.call(blocks[x]);
      if (Blockly.Names.equals(procName[0], name)) {
        return false;
      }
    }
  }
  return true;
};
      
      Blockly.Tooltip.svgImg_ = null;
      
/**
 * Delay before tooltip appears.
 */
Blockly.Tooltip.HOVER_MS = 100;
      

/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseMove_ = function(e) {
 // if (!Blockly.Tooltip.element_ || !Blockly.Tooltip.element_.tooltip) {
    // No tooltip here to show.
   // return;
  //} //else if ((Blockly.ContextMenu && Blockly.ContextMenu.visible) 
      //       ) { // ||Blockly.Block.dragMode_ != 0 COMMENT OUT DRAG MODE
    // Don't display a tooltip when a context menu is active, or during a drag.
    //return;
 // }
  if (Blockly.Tooltip.poisonedElement_ != Blockly.Tooltip.element_) {
    // The mouse moved, clear any previously scheduled tooltip.
    window.clearTimeout(Blockly.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Tooltip.lastX_ = e.clientX;
    Blockly.Tooltip.lastY_ = e.clientY;
    Blockly.Tooltip.showPid_ =
        window.setTimeout(Blockly.Tooltip.show_, Blockly.Tooltip.HOVER_MS);
  }
};

 
 /**
 * Hide the tooltip.
 */
Blockly.Tooltip.hide = function() {
	
	var imgNode = document.getElementById(tipImg);
	if (imgNode) {
		if (tipImg != originalRoof && tipImg != originalWall && tipImg != originalDoor && tipImg != originalWindows && tipImg != originalLights) {
			imgNode.style.visibility = "hidden";
			
		}
		else {
		
		
		
		}
	
	}
	
	//restore original image (if any) after preview
			imgNode = document.getElementById(tempImg);
		    if (imgNode) {
		  		imgNode.style.visibility = "visible";
		  		imgNode.style.zIndex = originalZindex;
		  	}
	
	
  	
  	
  if (Blockly.Tooltip.visible) {
    Blockly.Tooltip.visible = false;
    
    
    if (Blockly.Tooltip.svgGroup_) {
      Blockly.Tooltip.svgGroup_.style.display = 'none';
    }
  }
  window.clearTimeout(Blockly.Tooltip.showPid_);
};
 
      
      
/**
 * Create the tooltip and show it.
 * @private
 */
Blockly.Tooltip.show_ = function() {
  Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_;
  if (!Blockly.Tooltip.svgGroup_) {
    return;
  }
  // Erase all existing text.
  goog.dom.removeChildren(
      /** @type {!Element} */ (Blockly.Tooltip.svgText_));
  // Create new text, line by line.
  var tip = Blockly.Tooltip.element_.tooltip;
  if (goog.isFunction(tip)) {
    tip = tip();
    //console.log ("TIP = " + tip);
  }
  
  tipImg = tip;
  var type = tipImg.split("-");
  if (type[0] == "roof")
  	tempImg = originalRoof;
  else if (type[0] == "wall")
  	tempImg = originalWall;
  else if (type[0] == "door")
  	tempImg = originalDoor;
  else if (type[0] == "windows")
  	tempImg = originalWindows;
  else if (type[0] == "lights")
  	tempImg = originalLights;
  else
  	tempImg = '';
  	
  
  var imgNode = document.getElementById(tempImg);
  if (imgNode) {
  	imgNode.style.visibility = "hidden";
  	originalZindex = imgNode.style.zIndex;
  }
  
  imgNode = document.getElementById(tipImg);
  if (imgNode) {
  	imgNode.style.visibility = "visible";
  	imgNode.style.zIndex = Zindex++;
  }
  
  
  
  // Display the tooltip.
  Blockly.Tooltip.visible = true;
  Blockly.Tooltip.svgGroup_.style.display = 'block';
  // Resize the background and shadow to fit.
  var bBox = Blockly.Tooltip.svgText_.getBBox();
  var width = 2 * Blockly.Tooltip.MARGINS + bBox.width;
  var height = bBox.height;
  Blockly.Tooltip.svgBackground_.setAttribute('width', width);
  Blockly.Tooltip.svgBackground_.setAttribute('height', height);
  Blockly.Tooltip.svgShadow_.setAttribute('width', width);
  Blockly.Tooltip.svgShadow_.setAttribute('height', height);
  if (Blockly.RTL) {
    // Right-align the paragraph.
    // This cannot be done until the tooltip is rendered on screen.
    var maxWidth = bBox.width;
    for (var x = 0, textElement;
         textElement = Blockly.Tooltip.svgText_.childNodes[x]; x++) {
      textElement.setAttribute('text-anchor', 'end');
      textElement.setAttribute('x', maxWidth + Blockly.Tooltip.MARGINS);
    }
  }
  // Move the tooltip to just below the cursor.
  var anchorX = Blockly.Tooltip.lastX_;
  if (Blockly.RTL) {
    anchorX -= Blockly.Tooltip.OFFSET_X + width;
  } else {
    anchorX += Blockly.Tooltip.OFFSET_X;
  }
  var anchorY = Blockly.Tooltip.lastY_ + Blockly.Tooltip.OFFSET_Y;

  // Convert the mouse coordinates into SVG coordinates.
  var xy = Blockly.convertCoordinates(anchorX, anchorY, true);
  anchorX = xy.x;
  anchorY = xy.y;

  var svgSize = Blockly.svgSize();
  if (anchorY + bBox.height > svgSize.height) {
    // Falling off the bottom of the screen; shift the tooltip up.
    anchorY -= bBox.height + 2 * Blockly.Tooltip.OFFSET_Y;
  }
  if (Blockly.RTL) {
    // Prevent falling off left edge in RTL mode.
    anchorX = Math.max(Blockly.Tooltip.MARGINS, anchorX);
  } else {
    if (anchorX + bBox.width > svgSize.width - 2 * Blockly.Tooltip.MARGINS) {
      // Falling off the right edge of the screen;
      // clamp the tooltip on the edge.
      anchorX = svgSize.width - bBox.width - 2 * Blockly.Tooltip.MARGINS;
    }
  }
  Blockly.Tooltip.svgGroup_.setAttribute('transform',
      'translate(' + anchorX + ',' + anchorY + ')');
};
      
      //***********************************************************************************************************************
      
    /**
 * Show the context menu for this block.
 * @param {number} x X-coordinate of mouse click.
 * @param {number} y Y-coordinate of mouse click.
 * @private
 */
Blockly.Block.prototype.showContextMenu_ = function(x, y) {
  if (!this.contextMenu) {
    return;
  }
  // Save the current block in a variable for use in closures.
  var block = this;
  var options = [];

  if (this.deletable) {
    // Option to duplicate this block.
    var duplicateOption = {
      text: Blockly.MSG_DUPLICATE_BLOCK,
      enabled: true,
      callback: function() {
        block.duplicate_();
      }
    };
    if (this.getDescendants().length > this.workspace.remainingCapacity()) {
      duplicateOption.enabled = false;
    }
    options.push(duplicateOption);

    // Option to delete this block.
    // Count the number of blocks that are nested in this block.
    var descendantCount = this.getDescendants().length;
    if (block.nextConnection && block.nextConnection.targetConnection) {
      // Blocks in the current stack would survive this block's deletion.
      descendantCount -= this.nextConnection.targetBlock().
          getDescendants().length;
    }
    var deleteOption = {
      text: descendantCount == 1 ? Blockly.MSG_DELETE_BLOCK :
          Blockly.MSG_DELETE_X_BLOCKS.replace('%1', descendantCount),
      enabled: true,
      callback: function() {
        block.dispose(true, true);
      }
    };
    options.push(deleteOption);
  }

  // Option to get help.
  var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
  var helpOption = {enabled: !!url};
  helpOption.text = Blockly.MSG_HELP;
  helpOption.callback = function() {
    block.showHelp_();
  };
  options.push(helpOption);

  // Allow the block to add or modify options.
  if (this.customContextMenu) {
    this.customContextMenu(options);
  }

  Blockly.ContextMenu.show(x, y, options);
};
    
      
      
      //************************************************************************************************************************
      
      var toolbox1 = '<xml> <category></category> ';
      toolbox1 += '  <category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block>';
      toolbox1 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox1 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox1 += '</category> <category> </category>'; //close coloring
      
     
      toolbox1 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox2 = '<xml> <category></category> ';
      
      toolbox2 += '  <category name="+ Lights"> <block type="lights"></block>';
      toolbox2 += '</category> <category> </category>'; //close lights
      
      
      toolbox2 += '<category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block> ';
      toolbox2 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox2 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox2 += '</category> <category> </category>'; //close coloring
      
      
      toolbox2+= '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox3 = '<xml> <category></category> ';
      
      toolbox3 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="time_is"></block>';
      toolbox3 += '</category> <category> </category>'; //close controls
      
      toolbox3 += '  <category name="+ Lights"> <block type="lights"></block>';
      toolbox3 += '</category> <category> </category>'; //close lights
      
      toolbox3 += '  <category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block>   ';
      toolbox3 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox3 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox3 += '</category> <category> </category>'; //close coloring
      
      
      toolbox3 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox4 = '<xml> <category></category> ';
      
      toolbox4 += '<category name = "+ Home Definitions" custom="PROCEDURE">';
      toolbox4 += '</category> <category> </category>'; //close definitions
      
      toolbox4 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="time_is"></block>';
      toolbox4 += '</category> <category> </category>'; //close controls
      
      toolbox4 += '  <category name="+ Lights"> <block type="lights"></block>';
      toolbox4 += '</category> <category> </category>'; //close lights
      
      toolbox4 += '  <category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block>';
      toolbox4 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox4 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox4 += '</category> <category> </category>'; //close coloring
     
      toolbox4 += '</xml>';
      
      //------------------------------------------------------------------------------
      
      var toolbox5 = '<xml> <category></category> ';
      
      toolbox5 += '<category name = "+ Home Definitions" custom="PROCEDURE">';
      toolbox5 += '</category> <category> </category>'; //close definitions
      
      toolbox5 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="drawing_for"></block> ';
      toolbox5 += '</category> <category> </category>'; //close controls
      
      toolbox5 += '  <category name="+ Lights"> <block type="lights"></block>';
      toolbox5 += '</category> <category> </category>'; //close lights
      
      toolbox5 += '  <category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block> ';
      toolbox5 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox5 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox5 += '</category> <category> </category>'; //close coloring
      
      
      toolbox5 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox6 = '<xml> <category></category> ';
      
      toolbox6 += '<category name = "+ Home Definitions" custom="PROCEDURE">';
      toolbox6 += '</category> <category> </category>'; //close definitions
      
      toolbox6 += '<category name = "+ Controls">  <block type="control_repeat"></block>';
      toolbox6 += '</category> <category> </category>'; //close controls
      
      toolbox6 += '  <category name="+ Lights"> <block type="lights"></block>';
      toolbox6 += '</category> <category> </category>'; //close lights
      
      toolbox6 += '<category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block>';
      toolbox6 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox6 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox6 += '</category> <category> </category>'; //close coloring
      
      toolbox6 += '</xml>';
      
      //------------------------------------------------------------------------------
     
      
      
      switch(CURRENT_LEVEL)
      {
        case 1:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox1 } );
          setHtmlOpacity("hint1", 1.0);
          fadeOutAfterDelay("hint1", 5000);
          break;
        case 2:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox2 } );
          break;
        case 3:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox3 } );
          break;
        case 4:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox4 } );
          break; 
        case 5:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 6:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox6 } );
          break;
        case 7:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox6 } );
          break;  
        default:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox6 } );
      }
      
      if (CURRENT_LEVEL >= 4) {
      	 if ('sessionStorage' in window ) {
      	 	var saved_xml = '<xml>';
      	 	if (sessionStorage.procedure) {
      	 		var pArr = (sessionStorage.procedure).split('#');
      	 		for ( x=0; x < pArr.length; x++) {
      	 			saved_xml += pArr[x];
      	 		}
      	 		//saved_xml += sessionStorage.procedure;
      	 		saved_xml += '</xml>';	
      	 		var xml = Blockly.Xml.textToDom(saved_xml);
      			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
      			//window.setTimeout(BlocklyStorage.restoreBlocks, 0);
      	 	}
      	 	
      	 }
      	
      }
      
      
      document.getElementById('full_text_div').innerHTML= LEVELS_MSG[CURRENT_LEVEL - 1];
      //document.getElementById('level-h').innerHTML= "Level " + CURRENT_LEVEL + " :";
      
    }