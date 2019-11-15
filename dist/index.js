"use strict";

var countdownWrapper = document.querySelector('.countdown');
var countdownToggleButton = document.querySelector('.countdown-toggler');

var toggleOpenCountdown = function toggleOpenCountdown() {
  if (navigationWrapper.classList.contains('open')) {
    navigationWrapper.classList.remove("open");
  }

  countdownWrapper.classList.toggle("open");
};

if (countdownToggleButton) {
  countdownToggleButton.addEventListener('click', toggleOpenCountdown);
}

var navigationWrapper = document.querySelector('.main-nav');
var navigationToggleButton = document.querySelector('.nav-toggler');

var toggleOpenNavigation = function toggleOpenNavigation() {
  if (countdownWrapper.classList.contains('open')) {
    countdownWrapper.classList.remove("open");
  }

  navigationWrapper.classList.toggle("open");
};

if (navigationToggleButton) {
  navigationToggleButton.addEventListener('click', toggleOpenNavigation);
}

var renderAnimatingBackground = function renderAnimatingBackground() {
  var html = '';

  for (var i = 1; i <= 50; i++) {
    html += '<div class="shape-container--' + i + ' shape-animation"><div class="random-shape"></div></div>';
  }

  var shape = document.querySelector('.shape');

  if (shape) {
    shape.innerHTML += html;
  }
};

renderAnimatingBackground();

var getQueryParams = function getQueryParams(qs) {
  qs = qs.split('+').join(' ');
  var params = {};
  var tokens;
  var re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
};

console.log(getQueryParams(document.location.search));

var postData = function postData() {
  var url,
      data,
      response,
      _args = arguments;
  return regeneratorRuntime.async(function postData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
          data = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(url, {
            method: 'POST',
            // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            // no-cors, *cors, same-origin
            cache: 'no-cache',
            // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin',
            // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

            },
            redirect: 'follow',
            // manual, *follow, error
            referrer: 'no-referrer',
            // no-referrer, *client
            body: JSON.stringify(data) // body data type must match "Content-Type" header

          }));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          return _context.abrupt("return", _context.sent);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

var startTimer = document.getElementById('startTimer');

var postStartTimer = function postStartTimer(event) {
  var data;
  return regeneratorRuntime.async(function postStartTimer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          event.preventDefault();
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(postData('start-timer', {
            time: new Date()
          }));

        case 4:
          data = _context2.sent;
          console.log(JSON.stringify(data)); // JSON-string from `response.json()` call

          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

if (startTimer) {
  startTimer.onclick = function (event) {
    return postStartTimer(event);
  };
}