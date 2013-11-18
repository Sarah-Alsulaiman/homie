//-----------------------------------------------------------------------------------------
// Global Level variables                                                                   
//------------------------------------------------------------------------------------------
	var MAX_LEVEL = 7;
    var MIN_LEVEL = 1;
    var CURRENT_LEVEL = getLevel();
    var LEVELS_MSG = [" In general, a home consist of wall, roof, door, and windows. Can you draw a home using these blocks",
                        " The teacher wants you to draw a house that has brown walls, red roof, white door and windows. <BR/> &nbsp;&nbsp;&nbsp;&nbsp; She also wants you to turn the lights on for this house. Can you draw such a house? ",
                        " Can you program a house so that when it is daytime, the lights are swtitched off and when it is night time, it will be switched on?",
                        " Now, you can define a house and call it whatever you want, for example, you can draw a house with your favorite colors and call it 'my favorite house'",
                        " Your teacher likes the following colors: brown, black, white, red. Can you program a house so that when the teacher asks you to draw a house, it will draw with her colors, otherwise, it will draw your favorite house",
                        " Can you draw a flashing house? a flashing house will keep turning on and off the lights repeatedly!",
                       ];
                       
    var colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];
    var playing = false;
    var error = '';
    var img_blank;
    var xml_text = '<xml> </xml>';
    var saved_procedure = '<xml>';
    
//-----------------------------------------------------------------------------------------
// store procedures in session storage	                                                                 
//------------------------------------------------------------------------------------------  
    
    function storeProcedure () {
    	var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    	xml_text = Blockly.Xml.domToText(xml);
    	
    	xmlDoc = loadXMLString(xml_text);
    	
    	x = xmlDoc.getElementsByTagName('block');
    	for (i=0; i < x.length; i++) {
  			if (x[i].parentNode.nodeName == 'xml') {
  				att = x.item(i).attributes.getNamedItem("type");
  				if ( att.value == 'procedures_defnoreturn') {
  					cloneNode=x[i].cloneNode(true);
					//var text = new XMLSerializer().serializeToString(cloneNode);
  					saved_procedure += Blockly.Xml.domToText(cloneNode);
  				}
  			
  			}
  		}
  		
  		sessionStorage.procedure = saved_procedure;
  		//alert(saved_procedure);
	}
	
	
//------------------------------------------------------------------------------------------
// Attempt to open a web socket connection
//------------------------------------------------------------------------------------------
	var socket = null;
    if ("WebSocket" in window) {
      socket = new WebSocket("ws://localhost:8080");
      socket.onopen    = function(evt) { console.log("HTML connected."); }
      socket.onmessage = function(evt) { processEvent(evt.data); }
      socket.onerror   = function(evt) { console.log("HTML error in server connection"); }
      socket.onclose   = function(evt) { console.log("HTML server connection closed."); }
      
    }
    
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
      if (CURRENT_LEVEL < MAX_LEVEL) {
        $.jqDialog.confirm("Congratulations!<BR/> <BR/> Are you ready to proceed to level %1?".replace('%1', CURRENT_LEVEL + 1),
        function() { window.location = window.location.protocol + '//' +
                     window.location.host + window.location.pathname +
                     '?level=' + (CURRENT_LEVEL + 1); },    // callback function for 'YES' button
        
        function() {  }    // callback function for 'NO' button
        );  
      }
      
      else {
        $.jqDialog.alert("<br>End of game", function() { }); // callback function for 'OK' button
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
		
		/*var bgImg = document.createElement("img");
        bgImg.src = 'images/gym.png';
        bgImg.id = 'gym';
        bgImg.className = 'background';
        document.getElementById("images").appendChild(bgImg);*/
		
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
          		imgW1.src = 'images/window-' + COLORS[j] +'.png';
          		imgW1.id = 'window1-' + COLORS[j];
          		imgW1.className = 'window1';
          		document.getElementById("images").appendChild(imgW1);
          		//console.log(img.src);
          		
          		
          		var imgW2= document.createElement("img");
          		imgW2.src = 'images/window-' + COLORS[j] +'.png';
          		imgW2.id = 'window2-' + COLORS[j];
          		imgW2.className = 'window2';
          		document.getElementById("images").appendChild(imgW2);
          		//console.log(imgW2.src);
        	
      	}
      	
      		
    }	
    	
//---------------------------------------------------------------------------------------
// Utility functions                                                                                   
//---------------------------------------------------------------------------------------
	
	function setHtmlVisibility(id, visible) {
		var el = id.substring(0,6);
		var color = id.substring(7);
		console.log(color);
		if (el == "window") {
		
		var id1 = "window1-" + color;
		var id2 = "window2-" + color;
		
		var el1 = document.getElementById(id1);
		var el2 = document.getElementById(id2);
		
		el1.style.visibility = visible ? "visible" : "hidden";
		el2.style.visibility = visible ? "visible" : "hidden";
		
		}
		
		else {
			var el = document.getElementById(String(id));
   	   		var variations = id.substring(0,3);
      	
      		console.log("RECEIVED" + el);
      	
	      	if (variations == "wal") variations = "wall";
	      	else if (variations == "roo") variations = "roof";
	      	else variations = "door";
	      	
	  	   	//hideVariations(variations);
	  	  	
	      	if (el) {
	      		el.style.visibility = visible ? "visible" : "hidden";
	      	}
			
			}
			
		
   	}
   	
   	
   	function hideVariations (variation) {
   		if (variation == "top" || variation == "bottom") {
   			
   				for (var j=0; j < colors.length; j++) {
   					var item = variation.concat("-",colors[j].toString());
	    			console.log("item = " + item);
	    			item = document.getElementById(item);
	        		item.style.visibility = "hidden";
	        		
	    		
	  		}	 
  	 	}
   		
   		
   			
   		var places = ['gym', 'formal', 'restaurant', 'concert'];
   			
   		for ( var i=0; i < places.length; i++) {
   			var bg = document.getElementById(places[i]);
   			bg.style.visibility = "hidden";
   		}
   			
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
      var check = event.substring(0,8);
      if ( check == "@blockly" ) {
      	
      	if (event.substring(9, 15) == "error ") {
      		playing = false;
      		error = event.substring(15);
      		showError();
      	}
      	
      	else if (event == "@blockly GOT IT!") {
        	console.log("HTML received message from dart " + event);
      	}
      	
      	else if (event == "@blockly DONE!") {
        	console.log("HTML received message from dart " + event);
        	playing = false;
        	window.setTimeout(function() { advanceLevel(); }, 500);
      	}
      	
      	else if (event.substring(9, 12) == "bg ") {  //received bg to display
      		console.log("HTML received message from dart for background " + event);
	      	var bg = event.substring(12);
	      	setHtmlVisibility(bg, true);
      	}
      	
      	else {		// received an outfit to display
      		console.log("HTML received message from dart for outfit " + event);
	      	var outfit = event.substring(16);
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
      while (start < code.length && start != -1) {
        newLine = code.indexOf("\n",start);
        var curlyBrace = code.indexOf("}" ,start);
        console.log(newLine); console.log(curlyBrace);
        if ( newLine > 0 ) {
        	if ( curlyBrace > 0) {
        		if ( newLine -1 != curlyBrace ) {
            		connected = false;
            		break;
          		}
          		else { start = newLine+2; }
        	}
        	else { connected = true; break; } ///++++++
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
        
        //--------------------------------------------------
        // error 1: no blocks on the screen
        //--------------------------------------------------
        if (code.length == 0) {
          setHtmlOpacity("hint1", 1.0);
          fadeOutAfterDelay("hint1", 4000);
        }
        
        else {
          var connected = checkConnections(code);
          
          //--------------------------------------------------
          // error 2: blocks aren't connected
          //--------------------------------------------------
          if (!connected) {
            setHtmlOpacity("hint2", 1.0);
            fadeOutAfterDelay("hint2", 4000);
          }
        
          else {
          
            code = code.replace(/\]\[/g, '], [');
            code = (code.replace(/\)/g, '')).replace(/\(/g, '');
            code = code.replace(/\;/g, '');
            if (socket != null && socket.readyState == 1) {
              alert(code);
              socket.send('@dart'+ CURRENT_LEVEL + code);
              
              playing = true;
              //window.location.reload(true);
            }
          }
        }
      
      }
    }
    
    
//----------------------------------------------------------------------------------------
// Inject blockly to this page and display the message corrosponding to the current level
// Blockly redefined functions
//----------------------------------------------------------------------------------------
	function inject() {
	
		//Blockly.Workspace.prototype.traceOn = true;
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
      //***********************************************************************************************************************
      
      var toolbox1 = '<xml>';
      toolbox1 += '  <category></category>';
      
      toolbox1 += '  <category name="+ Roofs"> <block type="roof"></block>';
      toolbox1 += '</category> <category> </category>'; //close roofs
      
      toolbox1 += '<category name="+ Walls"> <block type="wall"></block>';
      toolbox1 += '</category> <category> </category>'; //close wallls
      toolbox1 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox2 = '<xml> <category></category> ';
      toolbox2 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block>';
      toolbox2 += '</category> <category> </category>'; //close tops
      
      toolbox2 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block>';
      
      toolbox2 += '</category> <category> </category>'; //close bottoms
      
      toolbox2 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox2 += '</category> <category> </category>'; //close coloring
      
      toolbox2 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox3 = '<xml> <category></category> ';
      toolbox3 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block>';
      toolbox3 += '</category> <category> </category>'; //close tops
      
      toolbox3 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block>';
      
      toolbox3 += '</category> <category> </category>'; //close bottoms
      
      toolbox3 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox3 += '</category> <category> </category>'; //close coloring
      
      toolbox3 += '<category name = "+ Controls">  <block type = "control_if"></block> <block type="going_to"></block> ';
      toolbox3 += '</category> <category> </category>'; //close controls
      toolbox3 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox4 = '<xml> <category></category> ';
      toolbox4 += '  <category name="+ Tops"> <block type="top1"></block> <block type="top2"></block> <block type="top3"></block> <block type="top4"></block> <block type="top5"></block>';
      toolbox4 += '</category> <category> </category>'; //close tops
      
      toolbox4 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block>';
      
      toolbox4 += '</category> <category> </category>'; //close bottoms
      
      toolbox4 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox4 += '</category> <category> </category>'; //close coloring
      
      toolbox4 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block>';
      toolbox4 += '</category> <category> </category>'; //close controls
      
      toolbox4 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox4 += '</category> <category> </category>'; //close definitions
      toolbox4 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox5 = '<xml> <category></category> ';
      toolbox5 += '  <category name="+ Building Blocks"> <block type="roof"></block> <block type="wall"></block> <block type="door"></block> <block type="windows"></block>  <block type="light"></block> ';
      toolbox5 += '</category> <category> </category>'; //close building blocks
      
      
      toolbox5 += '<category name="+ Coloring"> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox5 += '</category> <category> </category>'; //close coloring
      
      toolbox5 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="Time_is"></block> <block type="drawing_for"></block> <block type="control_repeat"></block>';
      toolbox5 += '</category> <category> </category>'; //close controls
      
      toolbox5 += '<category name = "+ Home Definitions" custom="PROCEDURE">  </category>';
      toolbox5 += '</category> <category> </category>'; //close definitions
      toolbox5 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox6 = '<xml> <category></category> ';
      
      toolbox6 += '<category name="+ Bottoms"> <block type="bottom1"></block>';
      
      toolbox6 += '</category> <category> </category>'; //close bottoms
      
      toolbox6 += '<category name="+ Coloring"> <block type="black"></block> <block type="pink"></block> <block type="grey"></block> ';
                   
      toolbox6 += '</category> <category> </category>'; //close coloring
      
      toolbox6 += '<category name = "+ Controls"> <block type="control_repeat"></block>';
      toolbox6 += '</category> <category> </category>'; //close controls
      
      toolbox6 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox6 += '</category> <category> </category>'; //close definitions
      toolbox6 += '</xml>';
      
      //------------------------------------------------------------------------------
      var toolbox7 = '<xml> <category></category> ';
     
      toolbox7 += '<category name="+ Bottoms"> <block type="bottom1"></block> <block type="bottom2"></block> <block type="bottom3"></block> <block type="bottom4"></block> <block type="bottom5"></block> <block type="bottom6"></block> <block type="bottom7"></block> <block type="bottom8"></block>';
      
      toolbox7 += '</category> <category> </category>'; //close bottoms
      
      toolbox7 += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
      toolbox7 += '</category> <category> </category>'; //close coloring
      
      toolbox7 += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="get_color_input"></block> <block type="control_repeat"></block>';
      toolbox7 += '</category> <category> </category>'; //close controls
      
      toolbox7 += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
      toolbox7 += '</category> <category> </category>'; //close definitions
      toolbox7 += '</xml>';
      
      /*
      if (CURRENT_LEVEL > 1) {
        toolbox += '<category name="+ Coloring"> <block type="get_color_var"></block> <block type="red"></block> <block type="blue"></block>' + 
                    '<block type="black"></block> <block type="pink"></block> <block type="grey"></block> <block type="orange"></block> <block type="purple"></block>' +
                    '<block type="lime"></block> <block type="gold"></block>' ;
        toolbox += '</category> <category> </category>'; //close coloring
        if (CURRENT_LEVEL > 2) {
          toolbox += '<category name = "+ Controls"> <block type = "control_if"></block> <block type="going_to"></block> <block type="get_color_input"></block> <block type="control_repeat"></block>';
          toolbox += '</category> <category> </category>'; //close controls
          if (CURRENT_LEVEL > 3) {
            toolbox += '<category name = "+ Outfit Definitions" custom="PROCEDURE"></category>';
            toolbox += '</category> <category> </category>'; //close definitions
          }
        }  
      }//*/
      
      
      switch(CURRENT_LEVEL)
      {
        case 1:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 2:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 3:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 4:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break; 
        case 5:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 6:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;
        case 7:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
          break;  
        default:
          Blockly.inject(document.getElementById('rosie-code'), {path: '../../rosieP2/blockly/', toolbox: toolbox5 } );
      }
      
    
      	 if ('sessionStorage' in window ) {
      	 	var saved_xml = '';
      	 	if (sessionStorage.procedure) {
      	 		saved_xml += sessionStorage.procedure;
      	 		saved_xml += '</xml>';	
      	 		var xml = Blockly.Xml.textToDom(saved_xml);
      			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
      			//window.setTimeout(BlocklyStorage.restoreBlocks, 0);
      	 	}
      	 	
      	 }
      
      
      document.getElementById('full_text_div').innerHTML= LEVELS_MSG[CURRENT_LEVEL - 1];
      document.getElementById('level-h').innerHTML= "Level " + CURRENT_LEVEL + " :";
      populate();
    }