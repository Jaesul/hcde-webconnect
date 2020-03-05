// Creating sketch variable for the new sketch

var sketch = function(p) {

  // Global var declaration 
  p.socket;
  p.data;
  p.serial;
  p.options = { baudrate: 9600};
  p.data;
  p.lastData;
  p.sensorVal;
  p.button;
  p.colors = [[255,255,255],[255,255,0],[0,0,255],[0,255,0],[255,0,0]];

  // Record the data coming in from serial 
  p.record = function() {           
    if(p.serial.available()) {
      var output = p.serial.readLine();
      if (output != "") {
        var json = JSON.parse(output);
        console.log(json);
        console.log(output);
        p.newDrawing(json[0], json[1]);
      }
    }
  }
  
  // Turn off all led's
  p.turnOff = function() {
    var canvasDiv = document.getElementById('p5-container');
    for (var i = 0; i < 10; i++) {
      p.fill(0, 0, 0);
      p.rect(canvasDiv.offsetWidth * 5 / 6 + 10, 30 + i * 15, 40, 10);
    }
    p.serial.write(1);
  }

  // Setup websocket and serial reading
  // if button is pressed turn off all led's
  p.setup = function() {
    p.serial = new p5.SerialPort(); 
    p.serial.list();
    p.serial.open('COM4', p.options);
    p.serial.on('data', p.record);
    var canvasDiv = document.getElementById('p5-container');
    p.socket = io.connect.connect('http://localhost:3000/');
    p.createCanvas(canvasDiv.offsetWidth,canvasDiv.offsetHeight);
    p.socket.on('mouse', p.newDrawing);
    p.createP('');
    p.button = p.createButton("Turn Off");
    console.log(p.button);
    p.button.mousePressed(p.turnOff);
  }

  // draw the canvas the state of the led's
  p.newDrawing = function(numLights, numbrightness) {
    p.clear();
    var canvasDiv = document.getElementById('p5-container');
    for (var i = 0; i < numLights; i++) {
      var colors = p.colors[i];
      p.fill(colors[0], colors[1], colors[2]);
      p.rect(i * canvasDiv.offsetWidth / 6, 0, canvasDiv.offsetWidth / 6, canvasDiv.offsetHeight - 100);
    }

    for (var i = numLights; i < 5; i++) {
      var colors = p.colors[i];
      p.fill(0, 0, 0);
      p.rect(i * canvasDiv.offsetWidth / 6, 0, canvasDiv.offsetWidth / 6, canvasDiv.offsetHeight - 100);
    }

    for (var i = 0; i < numbrightness; i++) {
      p.fill(255,255,0);
      p.rect(canvasDiv.offsetWidth * 5 / 6 + 10, 30 + i * 15, 40, 10);
    }

    for (var i = numbrightness; i < 10; i++) {
      p.fill(0, 0, 0);
      p.rect(canvasDiv.offsetWidth * 5 / 6 + 10, 30 + i * 15, 40, 10);
    }
  }
  
  // Write the state of the brightness of the led's
  p.draw = function() {
    var canvasDiv = document.getElementById('p5-container');
    p.fill(0,0,0);
    p.textLeading(100);
    p.textSize(20);
    p.text('Brightness', canvasDiv.offsetWidth * 5 / 6 + 10, 15);
  }
}


var container = new p5(sketch, 'p5-container');