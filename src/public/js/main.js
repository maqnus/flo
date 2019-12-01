/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const countdownWrapper = document.querySelector('.countdown');\nconst countdownToggleButton = document.querySelector('.countdown-toggler');\nconst toggleOpenCountdown = () => {\n  if (navigationWrapper.classList.contains('open')) {\n    navigationWrapper.classList.remove(\"open\");\n  }\n  countdownWrapper.classList.toggle(\"open\");\n}\nif (countdownToggleButton) {\n  countdownToggleButton.addEventListener('click', toggleOpenCountdown);\n}\n\nconst navigationWrapper = document.querySelector('.main-nav');\nconst navigationToggleButton = document.querySelector('.nav-toggler');\nconst toggleOpenNavigation = () => {\n  if (countdownWrapper.classList.contains('open')) {\n    countdownWrapper.classList.remove(\"open\");\n  }\n  navigationWrapper.classList.toggle(\"open\");\n}\nif (navigationToggleButton) {\n  navigationToggleButton.addEventListener('click', toggleOpenNavigation);\n}\n\nconst renderAnimatingBackground = () => {\n  let html = '';\n  for (var i = 1; i <= 50; i++) {\n    html += '<div class=\"shape-container--' + i + ' shape-animation\"><div class=\"random-shape\"></div></div>';\n  }\n  const shape = document.querySelector('.shape');\n  if (shape) {\n    shape.innerHTML += html;\n  }\n}\nrenderAnimatingBackground();\n\n\nconst getQueryParams = (qs) => {\n  qs = qs.split('+').join(' ');\n\n  const params = {};\n  let tokens;\n  const re = /[?&]?([^=]+)=([^&]*)/g;\n\n  while (tokens = re.exec(qs)) {\n    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);\n  }\n\n  return params;\n}\n\n\nconsole.log(getQueryParams(document.location.search));\n\n\nconst postData = async (url = '', data = {}) => {\n  // Default options are marked with *\n  const response = await fetch(url, {\n    method: 'POST', // *GET, POST, PUT, DELETE, etc.\n    mode: 'cors', // no-cors, *cors, same-origin\n    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached\n    credentials: 'same-origin', // include, *same-origin, omit\n    headers: {\n      'Content-Type': 'application/json'\n      // 'Content-Type': 'application/x-www-form-urlencoded',\n    },\n    redirect: 'follow', // manual, *follow, error\n    referrer: 'no-referrer', // no-referrer, *client\n    body: JSON.stringify(data) // body data type must match \"Content-Type\" header\n  });\n  return await response.json(); // parses JSON response into native JavaScript objects\n}\n\nconst startTimer = document.getElementById('startTimer');\nconst postStartTimer = async (event) => {\n  event.preventDefault();\n  try {\n    const data = await postData('start-timer', {\n      time: new Date()\n    })\n    console.log(JSON.stringify(data)); // JSON-string from `response.json()` call\n  } catch (error) {\n    console.error(error);\n  }\n}\nif (startTimer) {\n  startTimer.onclick = (event) => postStartTimer(event);\n}\n\nasync function sendData(url, data) {\n  const formData  = new FormData();\n\n  for(const name in data) {\n      formData.append(name, data[name]);\n  }\n\n  const response = await fetch(url, {\n      method: 'POST',\n      body: formData\n  });\n\n// ...\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });