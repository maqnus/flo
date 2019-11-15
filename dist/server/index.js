"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/stable");

require("regenerator-runtime/runtime");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _cloudinaryConfig = require("./config/cloudinaryConfig");

var _multerUpload = require("./middlewares/multerUpload");

var _firebase = _interopRequireDefault(require("firebase"));

var admin = _interopRequireWildcard(require("firebase-admin"));

var _grim8aebeFirebaseAdminsdkPc08tD4d16e4f = _interopRequireDefault(require("./config/grim-8aebe-firebase-adminsdk-pc08t-d4d16e4f38.json"));

var _firebaseConfig = _interopRequireDefault(require("./config/firebaseConfig.json"));

var utils = _interopRequireWildcard(require("./utils.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = (0, _express["default"])();

var http = require("http").createServer(app); // const io = require("socket.io")(http);


_firebase["default"].initializeApp(_firebaseConfig["default"]);

admin.initializeApp({
  credential: admin.credential.cert(_grim8aebeFirebaseAdminsdkPc08tD4d16e4f["default"]),
  databaseURL: "https://grim-8aebe.firebaseio.com"
});
app.set("port", process.env.PORT || 5000);
app.set("view engine", "pug");
app.use(_express["default"]["static"]("src/public"));
app.use((0, _bodyParser.json)()); // to support JSON-encoded bodies

app.use('*', _cloudinaryConfig.cloudinaryConfig);
app.use((0, _bodyParser.urlencoded)({
  extended: false
}));
app.get("/register", function (req, res) {
  res.render(__dirname + "/views/register", {
    pageTitle: "Register"
  });
});
app.post("/register", function (req, res) {
  _firebase["default"].auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function () {
    return res.redirect("/setup");
  })["catch"](function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message; // ...
  });
});
app.get("/setup", function _callee(req, res) {
  var userData, departments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 4:
          departments = _context.sent;
          res.render(__dirname + "/views/setup", {
            pageTitle: "Account setup",
            model: {
              departments: departments
            }
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post("/setup", (0, _multerUpload.multerUploads)('userimage'), function _callee2(req, res) {
  var userData, profileSlug, file, image, updates;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          profileSlug = utils.slugify(req.body.username);
          file = (0, _multerUpload.dataUri)(req).content;
          _context2.next = 6;
          return regeneratorRuntime.awrap(utils.uploadSingleImageToCloudinary(file));

        case 6:
          image = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(admin.database().ref("users/" + userData.uid).set({
            username: req.body.username,
            department: {
              title: req.body.department,
              slug: utils.slugify(req.body.department)
            },
            jobtitle: req.body.jobtitle,
            image: image,
            slug: profileSlug
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(admin.database().ref("departments/" + req.body.department + "/employees/" + userData.uid).set({
            username: req.body.username,
            image: image,
            jobtitle: req.body.jobtitle,
            slug: profileSlug
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 11:
          updates = {};
          updates["slug-to-user-id-map/" + profileSlug] = userData.uid;
          _context2.next = 15;
          return regeneratorRuntime.awrap(admin.database().ref().update(updates)["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 15:
          res.redirect("/mypage");

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.get("/reset-password", function (req, res) {
  res.render(__dirname + "/views/reset-password", {
    pageTitle: "Reset password",
    heading: "Forgot your password?"
  });
});
app.post("/reset-password", function (req, res) {
  console.log("reset password for email: ", req.body.email);
});
app.post("/logout", function (req, res) {
  _firebase["default"].auth().signOut().then(function () {
    // Sign-out successful.
    res.redirect("/");
  })["catch"](function (error) {// An error happened.
  });
});
app.get("/", function _callee3(req, res) {
  var userData;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (userData) {
            res.redirect("/mypage");
          }

          res.render(__dirname + "/views/login", {
            layoutType: "login",
            pageTitle: "Login"
          });

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.post("/login", function (req, res) {
  _firebase["default"].auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function () {
    res.redirect("/mypage");
  })["catch"](function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message; // ...

    res.redirect("/?error=".concat(errorCode));
  });
});
app.get("/mypage", function _callee4(req, res) {
  var userData, uid, departments, user, messageRequests, requests, request, _messageRequests$requ, from, message, project, fromUser;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          uid = userData && userData.uid;
          _context4.next = 5;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 5:
          departments = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), uid));

        case 8:
          user = _context4.sent;
          _context4.next = 11;
          return regeneratorRuntime.awrap(utils.getMessageRequests(admin.database(), uid));

        case 11:
          messageRequests = _context4.sent;
          requests = [];
          _context4.t0 = regeneratorRuntime.keys(messageRequests);

        case 14:
          if ((_context4.t1 = _context4.t0()).done) {
            _context4.next = 31;
            break;
          }

          request = _context4.t1.value;
          _messageRequests$requ = messageRequests[request], from = _messageRequests$requ.from, message = _messageRequests$requ.message, project = _messageRequests$requ.project;
          _context4.next = 19;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), from));

        case 19:
          fromUser = _context4.sent;
          _context4.t2 = requests;
          _context4.t3 = request;
          _context4.t4 = fromUser.username;
          _context4.t5 = message;
          _context4.next = 26;
          return regeneratorRuntime.awrap(utils.getProjectData(admin.database(), project));

        case 26:
          _context4.t6 = _context4.sent;
          _context4.t7 = {
            rid: _context4.t3,
            username: _context4.t4,
            message: _context4.t5,
            project: _context4.t6
          };

          _context4.t2.push.call(_context4.t2, _context4.t7);

          _context4.next = 14;
          break;

        case 31:
          res.render(__dirname + "/views/mypage", {
            pageTitle: user && user.username,
            heading: user && user.username,
            model: {
              user: _objectSpread({}, user, {
                alt: user && user.username
              }),
              requests: requests,
              departments: departments
            }
          });

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.get("/department/:department", function _callee5(req, res) {
  var userData, uid, departments, currentPage, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          uid = userData.uid;
          _context5.next = 5;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 5:
          departments = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(utils.getSpesificDepartment(admin.database(), req.params.department));

        case 8:
          currentPage = _context5.sent;
          _context5.next = 11;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), uid));

        case 11:
          user = _context5.sent;

          if (uid) {
            res.render(__dirname + "/views/department", {
              pageTitle: currentPage.title,
              heading: currentPage.title,
              model: {
                user: user,
                currentPage: currentPage,
                departments: departments
              }
            });
          } else {
            res.redirect("/");
          }

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.get("/employee/:user", function _callee6(req, res) {
  var userData, departments, uid, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          _context6.next = 4;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 4:
          departments = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(utils.getUidFromSlug(admin.database(), req.params.user));

        case 7:
          uid = _context6.sent;
          _context6.next = 10;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), uid));

        case 10:
          user = _context6.sent;
          res.render(__dirname + "/views/profile", {
            pageTitle: user && user.username,
            heading: user && user.username,
            model: {
              user: user,
              departments: departments
            }
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.get("/request/:requestId", function _callee7(req, res) {
  var userData, uid, departments;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          uid = userData.uid;
          _context7.next = 5;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 5:
          departments = _context7.sent;

          if (uid) {
            res.render(__dirname + "/views/request", {
              pageTitle: "Request",
              heading: "Request",
              model: {
                departments: departments
              }
            });
          } else {
            res.redirect("/");
          }

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.get("/create-request/:slug", function _callee8(req, res) {
  var userData, projects;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userData = auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          } // const requestUid = await getUidFromSlug(admin.database(), req.params.slug);


          _context8.next = 4;
          return regeneratorRuntime.awrap(utils.getProjects(admin.database()));

        case 4:
          projects = _context8.sent;
          res.render(__dirname + "/views/create-request", {
            pageTitle: "Create request",
            heading: "Create request",
            model: {
              toSlug: req.params.slug,
              projects: projects
            }
          });

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
});
app.post("/start-timer", function _callee9(req, res) {
  var userData, user, time, updates;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          userData = auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          _context9.next = 4;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), userData.uid));

        case 4:
          user = _context9.sent;
          time = req.body.time;
          updates = {};
          updates["users/" + userData.uid] = _objectSpread({}, user, {
            lastFocusStart: time
          });
          _context9.next = 10;
          return regeneratorRuntime.awrap(admin.database().ref().update(updates)["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 10:
          res.redirect("/mypage");

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  });
});
app.post("/create-request", function _callee10(req, res) {
  var userData, uid, _req$body, project, message, to, toUid, postData, newPostKey, updates;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData || !userData.uid) {
            res.redirect("/");
          }

          uid = userData.uid;
          _req$body = req.body, project = _req$body.project, message = _req$body.message, to = _req$body.to;
          _context10.next = 6;
          return regeneratorRuntime.awrap(utils.getUidFromSlug(admin.database(), to));

        case 6:
          toUid = _context10.sent;
          postData = {
            from: uid,
            project: project,
            message: message
          }; // Get a key for a new Post.

          newPostKey = admin.database().ref().child("requests").push().key;
          updates = {}; // updates["/requests/" + newPostKey] = postData;

          updates["/user-request/" + toUid + "/" + newPostKey] = postData;
          _context10.next = 13;
          return regeneratorRuntime.awrap(admin.database().ref().update(updates)["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }).then(function () {
            res.redirect("/mypage");
          }));

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  });
});
app.get("/chat", function _callee11(req, res) {
  var userData, uid, user, departments;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData) {
            res.redirect("/");
          }

          uid = userData.uid;
          _context11.next = 5;
          return regeneratorRuntime.awrap(utils.getUserData(admin.database(), uid));

        case 5:
          user = _context11.sent;
          _context11.next = 8;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 8:
          departments = _context11.sent;
          res.render(__dirname + "/views/chat", {
            pageTitle: "Chat",
            heading: "Chat",
            model: {
              user: user,
              departments: departments
            }
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  });
});
app.get("/settings", function _callee12(req, res) {
  var userData, departments;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData) {
            res.redirect("/");
          }

          _context12.next = 4;
          return regeneratorRuntime.awrap(utils.getDepartments(admin.database()));

        case 4:
          departments = _context12.sent;
          res.render(__dirname + "/views/settings", {
            layoutType: "Settings",
            pageTitle: "Settings",
            model: {
              departments: departments
            }
          });

        case 6:
        case "end":
          return _context12.stop();
      }
    }
  });
});
app.get("*", function _callee13(req, res) {
  var userData;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          userData = _firebase["default"].auth().currentUser;

          if (!userData) {
            res.redirect("/");
          }

          res.render(__dirname + "/views/404", {
            pageTitle: "404 Page not found",
            model: {}
          });

        case 3:
        case "end":
          return _context13.stop();
      }
    }
  });
}); // io.on('connection', socket => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
//   socket.on('chat message', props => {
//     firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         // User is signed in.
//         io.emit('chat message', props);
//         console.log('message: ' + props);
//       } else {
//         // No user is signed in.
//         io.emit('redirect', '/');
//       }
//     });
//   });
// });

http.listen(app.get("port"), function () {
  console.log("listening on *:5000");
});