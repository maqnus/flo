"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransitionElem = exports.getSession = exports.eraseCookie = exports.getCookie = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var getCookie = function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

exports.getCookie = getCookie;

var eraseCookie = function eraseCookie(name) {
  return document.cookie = name + '=; Max-Age=-99999999;';
};

exports.eraseCookie = eraseCookie;

var getSession = function getSession(name) {
  return sessionStorage.getItem(name);
};

exports.getSession = getSession;

var TransitionElem =
/*#__PURE__*/
function () {
  function TransitionElem(element) {
    _classCallCheck(this, TransitionElem);

    this.element = element;
  } // onRun
  // event is fired when a CSS transition has completed.In the
  // case where a transition is removed before completion, such as
  // if the transition - property is removed or display is set to none,
  // then the event will not be generated.


  _createClass(TransitionElem, [{
    key: "onRun",
    value: function onRun() {
      for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      if (this.element) {
        this.element.addEventListener('transitionrun', function (event) {
          if (props.length) {
            return props.forEach(function (prop) {
              if (event.propertyName == prop) {
                console.log('transitionstart: ', event);
              }
            });
          }

          console.log('transitionstart: ', event);
          return event;
        });
      }
    } // onCancel
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.

  }, {
    key: "onCansel",
    value: function onCansel() {
      for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }

      if (this.element) {
        this.element.addEventListener('transitioncansel', function (event) {
          if (props.length) {
            return props.forEach(function (prop) {
              if (event.propertyName == prop) {
                console.log('transitionstart: ', event);
              }
            });
          }

          console.log('transitionstart: ', event);
          return event;
        });
      }
    } // onStart
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.

  }, {
    key: "onStart",
    value: function onStart() {
      var _this = this;

      var _len3,
          props,
          _key3,
          _args = arguments;

      return regeneratorRuntime.async(function onStart$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              for (_len3 = _args.length, props = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                props[_key3] = _args[_key3];
              }

              if (!this.element) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return regeneratorRuntime.awrap(new Promise(function (resolve) {
                _this.element.addEventListener('transitionstart', function (event) {
                  if (props.length) {
                    props.map(function (prop) {
                      if (event.propertyName == prop) {
                        resolve(event);
                      }
                    });
                  }

                  resolve(event);
                });
              }));

            case 4:
              return _context.abrupt("return", _context.sent);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    } // onEnd
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.

  }, {
    key: "onEnd",
    value: function onEnd() {
      for (var _len4 = arguments.length, props = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        props[_key4] = arguments[_key4];
      }

      if (this.element) {
        return this.element.addEventListener('transitionend', function (event) {
          if (props.length) {
            return props.forEach(function (prop) {
              if (event.propertyName == prop) {
                console.log('transitionstart: ', event);
              }
            });
          }

          console.log('transitionstart: ', event);
          return event;
        });
      }
    }
  }]);

  return TransitionElem;
}(); // new TransitionElem(document.querySelector('.countdown-animation-background'))
//     .onStart('width').then(event => {
//         console.log(event);
//     });


exports.TransitionElem = TransitionElem;