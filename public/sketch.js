// Creating sketch variable for the new sketch

var sketch = function(p) {

  // Global var declaration 
  p.brightnessSlider;
  p.socket;
  p.serial;
  p.options = { baudrate: 9600};
  p.on = true;
  p.previousSliderState;
  p.button;

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
  p.action = function() {
    p.serial.write(0);
    if (!p.on) {
      p.background(253,206,42);
    } else {
      p.background(214,183,90);
    }
    p.on = !p.on;
  }

  // Setup websocket and serial reading
  // if button is pressed turn off all led's
  p.setup = function() {
    p.openSerial();
    var canvasDiv = document.getElementById('p5-container');
    p.socket = io.connect.connect('http://localhost:3000/');
    p.createCanvas(canvasDiv.offsetWidth,canvasDiv.offsetHeight + 5);
    p.background(254,226,39);
    p.createInputs();
  }

  p.createInputs = function() {
    p.brightnessSlider = p.createSlider();
    p.brightnessSlider.center('horizontal')
    p.button = p.createButton('Power');
    p.button.mousePressed(p.action);
    p.button.center('horizontal');
    p.button.addClass('powerButton')
  }

  p.openSerial = function() {
    p.serial = new p5.SerialPort(); 
    p.serial.list();
    p.serial.open('COM4', p.options);
    p.serial.on('data', p.record);
  }

  p.draw = function() {
    let sliderValue = p.brightnessSlider.value();
    if (p.previousSliderState != sliderValue) {
      p.previousSliderState = sliderValue;
      console.log(sliderValue);
      p.serial.write(sliderValue);
    }
  }
}


var container = new p5(sketch, 'p5-container');