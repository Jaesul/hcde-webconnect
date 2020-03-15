// Creating sketch variable for the new sketch
var sketch = function(p) {

  // Global var declaration 
  p.brightnessSlider;
  p.socket;
  p.serial;
  p.options = { baudrate: 9600};
  p.on;
  p.previousSliderState;
  p.button;
  p.state = null;
  p.previousState;

  // Record the data coming in from serial 
  // Checks to see if existing data is the same 
  // as the incoming, if it's different change the 
  // state of the webapp to match the state of the light
  p.record = function() {           
    if(p.serial.available()) {
      var input = p.serial.readLine();
      if (input != "") {
        let json = JSON.parse(input);
        console.log(json);
        if (p.state == null || (p.state[0] != json[0] 
          || p.state[1] != json[1])) {
          p.updateState(json);
        }
      }
    }
  }

  // Updates the state of the webapp to match the light 
  p.updateState = function(json) {
    p.previousState = p.state;
    p.state = json;
    p.on = json[1];
    let lightPic = document.querySelector('.light-pic');
    if (p.on == 1) {
      lightPic.src = 'light-on.png';
      p.background(253,206,42);
      document.getElementById("main-slider").disabled = false;
    } else if (p.on == 0) {
      lightPic.src = 'light-off.png';
      p.background(214,183,90);
      document.getElementById("main-slider").disabled = true;
    }

    // Socket stuff that doesn't work... yet
    let data = json;
    p.socket.emit('stateChange', data)
  }
  
  // Send to serial the state of the webapp to the 
  // light
  p.action = function() {
    if (p.on == 1) {
      p.serial.write(0);
    } else {
      p.serial.write(1);
    }
  }

  // Setup websocket, canvas and all inputs 
  p.setup = function() {
    p.openSerial();
    var canvasDiv = document.getElementById('p5-container');
    p.socket = io.connect.connect('http://localhost:3000/');
    p.createCanvas(canvasDiv.offsetWidth,canvasDiv.offsetHeight + 5);
    p.background(254,226,39);
    p.createInputs();
    p.socket.on('stateChange', p.updateState);
  }

  // Creates all inputs 
  p.createInputs = function() {
    p.brightnessSlider = p.createSlider(1, 255, 127);
    p.brightnessSlider.id('main-slider');
    p.brightnessSlider.center('horizontal')
    p.button = p.createButton('Power');
    p.button.mousePressed(p.action);
    p.button.center('horizontal');
    p.button.addClass('powerButton')
  }

  // Opens serial port to connect with light
  p.openSerial = function() {
    p.serial = new p5.SerialPort(); 
    p.serial.list();
    p.serial.open('COM4', p.options);
    p.serial.on('data', p.record);
  }

  // Updates the state of the light when the 
  // slider is moved 
  p.draw = function() {
    let sliderValue = p.brightnessSlider.value();
    if (p.previousSliderState != sliderValue) {
      p.previousSliderState = sliderValue;
      p.serial.write(sliderValue);
    }
  }

  // Stuff that doesn't work and will never work.
  p.updateSlider = function(sliderValue) {
    p.brightnessSlider.remove(1, 255, sliderValue);
    p.brightnessSlider.center('horizontal')
  }
}

// Setting the canvas to the correct html container
var container = new p5(sketch, 'p5-container');