"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataUri = exports.multerUploads = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _datauri = _interopRequireDefault(require("datauri"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var storage = _multer["default"].memoryStorage();

var multerUploads = function multerUploads(fieldName) {
  return (0, _multer["default"])({
    storage: storage
  }).single(fieldName);
};

exports.multerUploads = multerUploads;
var dUri = new _datauri["default"]();
/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */

var dataUri = function dataUri(req) {
  return dUri.format(_path["default"].extname(req.file.originalname).toString(), req.file.buffer);
};

exports.dataUri = dataUri;