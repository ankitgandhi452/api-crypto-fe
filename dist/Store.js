"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class Store {
  constructor() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _defineProperty(this, "store", {});
    this.store = store;
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.del = this.del.bind(this);
    this.clone = this.clone.bind(this);
  }
  set(key, value) {
    if (value == null || !key) {
      return;
    }
    this.store[key] = value;
    return {
      [key]: value
    };
  }
  get(key) {
    if (!key) {
      return;
    }
    return this.store[key];
  }
  del(key) {
    if (!key) {
      return;
    }
    var value = this.store[key];
    delete this.store[key];
    return value;
  }
  clone() {
    return new Store(this.store);
  }
}
exports.default = Store;