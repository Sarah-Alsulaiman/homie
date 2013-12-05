import 'dart:html';
import 'dart:json';
import 'dart:async';
import 'dart:math';


/** Global list of compiled outfits sequence **/
List outfits = new List(); 

/** Global list of procedures created by the user **/
List subroutines;

/** Global list of commands created by the user **/
List commands;

/** Timer to call display periodically **/
Timer timer;

/** Random Place **/
String CURRENT_PLACE;

/** Random Color **/
String CURRENT_COLOR;

/** Random weather **/
String CURRENT_WEATHER;

/** Colors available for each outfit **/
List colors = ['red', 'blue', 'gold', 'lime', 'black', 'pink', 'orange' , 'purple', 'grey'];

List parts;

bool consider = true;
bool check_input = false;


//format [ [blockName, value, levels] ]
List blocks = [  ['repeat', false, 6],  ['lights', false, 2], ['lights_on', false, 2],
                 ['roof', false, 1,2,3,4,5,6], ['windows', false, 1,2,3,4,5,6], ['door', false, 1,2,3,4,5,6], ['wall', false, 1,2,3,4,5,6],
                 ['abstraction', false, 4, 5], ['call', false, 4, 5], ['func', false, 4, 5],
                 ['other', false, 3, 5], ['then', false, 3, 5],
                 ['time', false, 3], ['drawing', false, 5], ['if', false, 3, 5],
                  
              ];


var CURRENT_LEVEL = 1;
var CURRENT_block;
String ERR_MSG = '';

var CURRENT_PERSON;
var CURRENT_TIME;

// write blocks[top] = true and then another map uses[top] = levels...
Map block_name = new Map <String, int>();
Map text = new Map <String, String> ();

//----------------------------------------------------------------------
// Main function
//----------------------------------------------------------------------
void main() {
  
  window.onMessage.listen((evt) {
    
    String msg = "${evt.data}";
    
    if (msg.startsWith("@dart")) {
      CURRENT_LEVEL = msg.substring(5,6);
      //print("CURRENT LEVEL = " + CURRENT_LEVEL);
      
      parts = msg.split("#");
      randomize();
      /*if (CURRENT_LEVEL == "7") {
        var level7_top = "top2-";
        level7_top += CURRENT_COLOR;
        sendMessage("outfit " + level7_top);
      }*/
      
      //print("COMPILE THIS: " + parts[1]);
      compile(parts[1]);
      
      print('Dart received code from HTML ');
      
      if (outfits.length != 0) {
        Timer.run(() => display());
      }
      
      timer = new Timer.periodic(new Duration(milliseconds: 1000), (Timer t) {
        if (outfits.length == 0) {
          timer.cancel();
          if (CURRENT_LEVEL == "3") {
            String background = CURRENT_TIME;
            sendMessage("bg " + background);
          }
          
          else if (CURRENT_LEVEL == "5") {
            String background = CURRENT_PERSON;
            sendMessage("bg " + background);
            
          }
          if (check_input) {
            sendMessage("DONE!");
          }
          
          else
            sendMessage("error " + text[ERR_MSG]);
        }
        else {
          //if (check_input)
          display();
        }
      });
      sendMessage("GOT IT!");
    }

  });
  
  block_name['repeat'] = 0;
  
  block_name['lights'] = 1;
  block_name['lights_on'] = 2;
  
  block_name['roof'] = 3;
  block_name['windows'] = 4;
  block_name['door'] = 5;
  block_name['wall'] = 6;
 
  
  block_name['abstraction'] = 7;
  block_name['call'] = 8;
  block_name['func'] = 9;
  
  block_name['other'] = 10;
  block_name['then'] = 11;
  block_name['time'] = 12;
  block_name['drawing'] = 13;
  block_name['if'] = 14;
 
  
  text['repeat'] = "The lights should go on and off repeatedly, <br> choose a block to repeat over and over again<br>";
  
  text['lights'] = "Remember, you should specify the lights status";
  
  text['lights_on'] = "Remember, you should turn the lights on!";
  
  text['roof'] = "Make sure you add a roof to your house!";
  text['wall'] = "Make sure you add a wall to your house!";
  text['door'] = "Make sure you add a door to your house!";
  text['windows'] = "Make sure you add windows to your house!";
  
  text['other'] = "Make sure you choose an outfit for each case";
  text['then'] = "Make sure you choose an outfit for each case";
  text['time'] = "Remember, it might be a morning or evening";
  text['drawing'] = "Remember, there are two cases";
  text['if'] = "Choose a block to help you decide";
  
  text['abstraction'] = "Make sure you fill the definition";
  text['call'] = "You created a definition but didn't use it!";
  text['func'] = "Outfit definitions menu help you create a shortcut";
  
}

//--------------------------------------------------------------------------
// Compile user program
//--------------------------------------------------------------------------
void compile(String json) {
  outfits.clear();
  clearBlocks();
  
  ERR_MSG = '';
  
  check_input = true;
  
  var function_begin = json.indexOf('{');
  var function_end = json.lastIndexOf('}');
  
  if (function_end != -1 && function_begin != -1 ) {
    blocks[block_name['func']][1] = true; print("FUNC FOUND");
    var functionsLine = json.substring(function_begin, function_end+1);
    functionsLine = (((functionsLine.replaceAll('{', '')).replaceAll('}', ''))
                      .replaceAll('\n', '')).replaceAll('][', '], [');
    
    subroutines = parseCode(functionsLine);
  }
  
  var scriptIndex = (function_end+1 == -1) ? 0 : function_end+1;
  var script = json.substring(scriptIndex);
  
  commands = parseCode(script);
  //print(commands);
  
  
  interpret(commands);
  
  // Validate user answers here...
  //format blocks = [ [blockName, value, levels] ]
  
  if (ERR_MSG.isEmpty)
    validate();
  
  else
    check_input = false;
}


void validate() {
  for (var i= (blocks.length) - 1; i >= 0 ; i--) {
    var num_level = (blocks[i].length); 
    //print("NUM LEVEL = " + num_level.toString());
    for (var j=2; j< num_level; j++) { // first two elements are not levels
      if (blocks[i][j].toString() == CURRENT_LEVEL ) { // if current level needs this block
        //print("CURRENT LEVEL NEEDS " + blocks[i][0]);
        if (! blocks[i][1]) {
          //print( blocks[i][1].toString());
          ERR_MSG = blocks[i][0];
          break;
        }
        
      }
    }
    if (! ERR_MSG.isEmpty) {
      print (ERR_MSG + " NOT FOUND");
      check_input = false;
      break;
    }
      
  }
  
 
 
}
//--------------------------------------------------------------------------
// Parse JSON returned from the program
//--------------------------------------------------------------------------
List parseCode(code) {
  code = code.split('\n');
  List parsedCode;
  //print(code);
  
  for (int i=0; i<code.length; i++) {
    String f = '[ ${code[i]} ]';
    parsedCode = parse(f);
  }
  
  return parsedCode;
}

//--------------------------------------------------------------------------
// Display outfits from user's program 
//--------------------------------------------------------------------------
void display() {
  
  String outfit = outfits[0]; //print("current = $outfit");
  sendMessage("outfit " + outfit);
  outfits.removeAt(0);
  
}


//--------------------------------------------------------------------------
// Interpret the user program
//--------------------------------------------------------------------------
void interpret (List commands) { 
  for (int j=0; j<commands.length; j++) {
    if (commands[j] is !List || commands[j][0] == "GET") { //ensure output blocks are connected
      break;
    }
    else {
      List nested = commands[j] as List;
      //print("inner = ${nested.length} ");
      
      if (nested[0] == "if") {processIf(nested);}
      else if (nested[0] == "repeat") {processRepeat(nested);}
      else if (nested[0] == "CALL") {processCall(nested);}
      else { //not a block
        var part = nested[0];
        var color = nested[1];
        
        var outfit = part+color;
        
        if (part.startsWith("roof") && consider) { 
          blocks[block_name['roof']][1]= true; 
        }
          
        else if (part.startsWith("wall") && consider) { 
          blocks[block_name['wall']][1]= true; 
        }
        
        else if (part.startsWith("door") && consider) { 
          blocks[block_name['door']][1]= true;  
        }
        
        else if (part.startsWith("windows") && consider) { 
          blocks[block_name['windows']][1]= true;
        }
        
        else if (part.startsWith("lights") && consider) { 
          blocks[block_name['lights']][1]= true; 
          if (color == "on") {
            blocks[block_name['lights_on']][1]= true; 
          }
          
        }
        
        if (consider) {
          outfits.add(outfit);
          //print(outfit + " ADDED!");
        }
      
      }
    }
   }
    
}


//--------------------------------------------------------------------------
// Repeat block
//--------------------------------------------------------------------------
void processRepeat(List nested) {
  var count = nested[1];
  var block = nested[2];
  var outfit;
  
  blocks[block_name['repeat']][1] = true; print("repeat FOUND");
  
  for (var i=0; i < count; i++) {
    interpret(block);
  }
}


//--------------------------------------------------------------------------
// CallFunction block
//--------------------------------------------------------------------------
void processCall(List nested) {
  var funcName = nested[1];
  var block;
  var outfit;
  
  blocks[block_name['call']][1] = true; print("CALL FOUND");
  for (int i=0; i < subroutines.length; i++) {
    if (funcName == subroutines[i][0]) {
      block = subroutines[i][1];
      if (block.length >= 1) {blocks[block_name['abstraction']][1] = true;}
      
      interpret(block);
    }
  }
   
}


//--------------------------------------------------------------------------
// IF block
//--------------------------------------------------------------------------
void processIf(List nested) {
  var condition = nested [1][0];
  var then = nested[2];
  var other = nested[3];
  List result;
  var outfit;
  
  blocks[block_name['if']][1] = true;
  
  if (then.length >= 1 ) {blocks[block_name['then']][1] = true; print("THEN POPULATED");}
  if (other.length >= 1) {blocks[block_name['other']][1] = true; print("OTHER POPULATED");}
  
  if (condition != 0) {
    if (condition == "Drawing") { //DRAWING FOR block is connected to IF block
      blocks[block_name['drawing']][1] = true;
      
      consider = false;
      interpret(then);
      interpret(other);
      
      consider = true;
      result = (nested[1][1] == CURRENT_PERSON)? then : other;
      //result could be empty!
      if (result.length != 0)
        interpret(result);
        
    }
      
     
    else if (condition == "Time")  {  //TIME CONDITION
      blocks[block_name['time']][1] = true;
      
      consider = false;
      interpret(then);
      interpret(other);
      
      consider = true;
      result = (nested[1][1] == CURRENT_TIME)? then : other;
      interpret(result);
    }
  }
  
  else { //nothing is connected to if statement
    
    consider = false;
    interpret(then);
    interpret(other);
    
    consider = true;
    interpret(other);
    
  }

  }

//--------------------------------------------------------------------------
// Generate random place and color
//--------------------------------------------------------------------------
void randomize() {
  
  var places;
  if (CURRENT_LEVEL == "3") {
    places = ['gym', 'restaurant'];
  }
  
  else {
    places = ['formal', 'concert'];
  }
  
  
  Random rnd = new Random();
  var x = rnd.nextInt(2);
  
  CURRENT_PLACE = places[x];
  
  var colors = ['black', 'purple'];
  
  rnd = new Random();
  x = rnd.nextInt(2);
  
  CURRENT_COLOR = colors[x];
  
  
  var people = ['teacher', 'friend'];
  rnd = new Random();
  x = rnd.nextInt(2);
  
  CURRENT_PERSON = people[x];
  
  
  var time = ['morning', 'evening'];
  rnd = new Random();
  x = rnd.nextInt(2);
  
  CURRENT_TIME = time[x];
  
  
  
}



//--------------------------------------------------------------------------
// Clear blocks
//--------------------------------------------------------------------------
void clearBlocks() {
  
  blocks[block_name['repeat']][1] = false;
  blocks[block_name['lights']][1] = false;
  blocks[block_name['lights_on']][1] = false;
  blocks[block_name['roof']][1] = false;
  blocks[block_name['wall']][1] = false;
  blocks[block_name['door']][1] = false;
  blocks[block_name['windows']][1] = false;
  
  blocks[block_name['if']][1] = false;
  blocks[block_name['then']][1] = false;
  blocks[block_name['other']][1] = false;
  blocks[block_name['drawing']][1] = false;
  blocks[block_name['time']][1] = false;
  
  blocks[block_name['func']][1] = false;
  blocks[block_name['call']][1] = false;
  blocks[block_name['abstraction']][1] = false;
  
}  

//--------------------------------------------------------------------------
// Send a message to the javascript blockly window
//--------------------------------------------------------------------------
void sendMessage(String message) {
  /*if (ws != null && ws.readyState == WebSocket.OPEN) {
    ws.send("@blockly#$CONNECTION_ID#$message");
  }*/
  var msg = "@blockly#$message";
  var origin = window.location.protocol + "//" + window.location.host;
  window.postMessage(msg, origin);
}

