// very basic localStorage mock //
const localStorage = {
  store: {},
  getItem(key) {
    return this.store[key];
  },
  setItem(key, value) {
    this.store[key] = value;
  }
};

global.localStorage = localStorage;
