"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatBuffer = concatBuffer;
exports.toBuffer = toBuffer;
exports.toString = toString;
function toBuffer() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  switch (from) {
    case 'base64':
      return _base64ToArrayBuffer(string);
    case 'utf8':
      return _utf8toArrayBuffer(string);
  }
}
function toString(buffer) {
  var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  switch (to) {
    case 'base64':
      return _arrayBufferToBase64String(buffer);
    case 'utf8':
      return _arrayBufferToText(buffer);
  }
}
function concatBuffer() {
  var bufferArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var length = bufferArray.reduce((length, buffer) => length + buffer.byteLength, 0);
  var outputBuffer = new Uint8Array(length);
  var filledBufferStart = 0;
  bufferArray.forEach(buffer => {
    outputBuffer.set(new Uint8Array(buffer), filledBufferStart);
    filledBufferStart = filledBufferStart + buffer.byteLength;
  });
  return outputBuffer.buffer;
}
function _base64ToArrayBuffer(string) {
  var utf8String = atob(string);
  var buffer = new Uint8Array(utf8String.length);
  for (var i = 0; i < utf8String.length; i++) {
    buffer[i] = utf8String.charCodeAt(i);
  }
  return buffer.buffer;
}
function _utf8toArrayBuffer(string) {
  var unescapedString = unescape(encodeURIComponent(string)); // 2 bytes for each char
  var buffer = new Uint8Array(unescapedString.length);
  for (var i = 0; i < unescapedString.length; i++) {
    buffer[i] = unescapedString.charCodeAt(i);
  }
  return buffer.buffer;
}
function _arrayBufferToBase64String(arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer);
  var byteString = '';
  for (var i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return btoa(byteString);
}
function _arrayBufferToText(arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer);
  var byteString = '';
  for (var i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return byteString;
}