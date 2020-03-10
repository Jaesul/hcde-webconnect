"use strict";
(function() {

  window.addEventListener("load", init);

  let lightOn = true;

  function init() { 
    id('login').addEventListener('keypress', function (e) {
        passwordEnter(e);
    });

    qs('.powerButton').addEventListener('click', function () {
      if (lightOn) {
        qs('.light-pic').src = 'light-off.png';
        qs('.light-pic').classList.add('scale08');
        lightOn = !lightOn;
      } else {
        qs('.light-pic').src = 'light-on.png';
        lightOn = !lightOn;
        qs('.light-pic').classList.remove('scale08');
      }
    })
  }

  function passwordEnter(e, field) {
    if (e.key === 'Enter') {
        id('error-msg').classList.add('no-opacity');
        setTimeout(() => {  
            if(id('login').value == '1234') {
                qs('.login-page').classList.add('slide-up');
            } else {
                id('error-msg').classList.remove('no-opacity');
            }
        }, 200);
    }
  }

  function qsa(elementName) {
    return document.querySelectorAll(elementName);
  }

  function qs(elementName) {
    return document.querySelector(elementName);
  }

  function id(idName) {
    return document.getElementById(idName);
  }
})();