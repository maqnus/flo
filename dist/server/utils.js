"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadSingleImageToCloudinary = exports.getProjects = exports.getProjectData = exports.getMessageRequests = exports.getUserData = exports.getUidFromSlug = exports.getSpesificDepartment = exports.getDepartments = exports.slugify = void 0;

var _cloudinaryConfig = require("./config/cloudinaryConfig");

var slugify = function slugify(string) {
  var a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  var b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  var p = new RegExp(a.split("").join("|"), "g");
  return string.toString().toLowerCase().replace(/\s+/g, "-") // Replace spaces with -
  .replace(p, function (c) {
    return b.charAt(a.indexOf(c));
  }) // Replace special characters
  .replace(/&/g, "-and-") // Replace & with 'and'
  .replace(/[^\w\-]+/g, "") // Remove all non-word characters
  .replace(/\-\-+/g, "-") // Replace multiple - with single -
  .replace(/^-+/, "") // Trim - from start of text
  .replace(/-+$/, ""); // Trim - from end of text
};

exports.slugify = slugify;

var getDepartments = function getDepartments(db) {
  return regeneratorRuntime.async(function getDepartments$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.ref("departments/").once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getDepartments = getDepartments;

var getSpesificDepartment = function getSpesificDepartment(db, department) {
  return regeneratorRuntime.async(function getSpesificDepartment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(db.ref("departments/".concat(department)).once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getSpesificDepartment = getSpesificDepartment;

var getUidFromSlug = function getUidFromSlug(db, slug) {
  return regeneratorRuntime.async(function getUidFromSlug$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(db.ref("slug-to-user-id-map/".concat(slug)).once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getUidFromSlug = getUidFromSlug;

var getUserData = function getUserData(db, uid) {
  return regeneratorRuntime.async(function getUserData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(db.ref("users/" + uid).once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context4.abrupt("return", _context4.sent);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.getUserData = getUserData;

var getMessageRequests = function getMessageRequests(db, uid) {
  return regeneratorRuntime.async(function getMessageRequests$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(db.ref("user-request/" + uid).once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context5.abrupt("return", _context5.sent);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.getMessageRequests = getMessageRequests;

var getProjectData = function getProjectData(db, pid) {
  return regeneratorRuntime.async(function getProjectData$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(db.ref("projects/" + pid).once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context6.abrupt("return", _context6.sent);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.getProjectData = getProjectData;

var getProjects = function getProjects(db) {
  return regeneratorRuntime.async(function getProjects$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(db.ref("projects/").once("value").then(function (snapshot) {
            return snapshot.val();
          })["catch"](function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message; // ...
          }));

        case 2:
          return _context7.abrupt("return", _context7.sent);

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.getProjects = getProjects;

var uploadSingleImageToCloudinary = function uploadSingleImageToCloudinary(file) {
  return new Promise(function _callee(resolve) {
    return regeneratorRuntime.async(function _callee$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", _cloudinaryConfig.uploader.upload(file).then(function (result) {
              return resolve(result.url);
            }));

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
};

exports.uploadSingleImageToCloudinary = uploadSingleImageToCloudinary;