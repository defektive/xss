(function (window){

  const _c = {
    log: function (){
      Array.prototype.unshift.apply(arguments, ['DFKT']);
      console.log.apply(console, arguments);
    },
    warn: function () {
      Array.prototype.unshift.apply(arguments, ['DFKT']);
      console.warn.apply(console, arguments);
    },
    error: function () {
      Array.prototype.unshift.apply(arguments, ['DFKT']);
      console.error.apply(console, arguments);
    },
    trace: function () {
      Array.prototype.unshift.apply(arguments, ['DFKT']);
      console.trace.apply(console, arguments);
    },
    info: function () {
      Array.prototype.unshift.apply(arguments, ['DFKT']);
      console.info.apply(console, arguments);
    }
  }

  const LOCAL_STORAGE_KEY = 'dfkt_data';
  const DEFAULT_STORE = {
    webpackFunctionToHook: 'webpackJsonp',
    stacksToIgnore: [],
    hooks: []
  };

  function _getPersistentData() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || DEFAULT_STORE;
    } catch {
      return DEFAULT_STORE;
    }
  }

  let _dfktDataStore = _getPersistentData();
  let _random = {};
  let _hooked = [];

  function _persistData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_dfktDataStore));
    _c.log(`data persisted`, `${_dfktDataStore.stacksToIgnore.length} Ignored Stacks`, `${_dfktDataStore.hooks.length} Hooks`)
  }

  function _dfktHook(what, where) {
    if(_hooked.indexOf(what) > -1) return
    try {
      let ar = what.split('.');
      let dfktAttrToHook = ar.pop();
      let dfktObjToHook = where || window;

      while (dfktObjToHook[ar[0]]) {
        dfktObjToHook = dfktObjToHook[ar.shift()];
      }

      _c.log(`hooking ${dfktAttrToHook} on ${dfktObjToHook}`);

      let dfktOriginalHookedFn = dfktObjToHook[dfktAttrToHook];
      dfktObjToHook[dfktAttrToHook] = function (a, b, c, d) {
        let trace = (new Error("DFKTStackTrace")).stack.split('\n');
        trace.shift();
        let stack = dfktAttrToHook + '' + trace.join('\n');

        if (_dfktDataStore.stacksToIgnore.indexOf(stack) === -1) {
          _c.trace(`Traced method (${dfktAttrToHook}) called`);
          _c.warn(this, arguments);
          _c.info('run ignore() to no longer break on this stack');
          ignore = function () {
            _dfktDataStore.stacksToIgnore.push(stack);
            _persistData();
          }
          clr = function () {
            _dfktDataStore.stacksToIgnore = [];
            _persistData();
          }
          _dfktDataStore; // reference so we can access it from the debugger
          debugger
        }

        return dfktOriginalHookedFn.apply(this, arguments);
      }

      _hooked.push(what);
      _dfktDataStore.hooks.indexOf(what) === -1 && _dfktDataStore.hooks.push(what) && _persistData();
    } catch(e) {
      _c.error(e);
    }
  }
  window._dfktHook = _dfktHook;

  _c.warn(`${_dfktDataStore.webpackFunctionToHook} is going to be hooked`);

  Object.defineProperty(window, _dfktDataStore.webpackFunctionToHook, {
    set: function(new_webpackFunction) {
      _c.warn(`${_dfktDataStore.webpackFunctionToHook} is hooked`);

      _random['_dfkt_new_webpackFunction'] = function () {
        let webPackRes = new_webpackFunction.apply(this, arguments);

        for (let i = 0; i < _dfktDataStore.hooks.length; i++) {
          let hook = _dfktDataStore.hooks[i];

          if(!hook.hooked) {
            _c.warn('checking hook', i);
            _dfktHook(hook);
          }
        }
        return webPackRes;
      }
    },
    get: function () {
      return _random['_dfkt_new_webpackFunction'];
    }
  });

  window._DfktHooks = (function _dfktHooks() {
    let _dfktOrgSetters = {};

    const {
      isPrototypeOf,
    } = Object.prototype;

    /**
     * Returns the key name for caching original setters.
     * @param {!Object} object The object of the to-be-wrapped property.
     * @param {string} name The name of the property.
     * @return {string} Key name.
     * @private
     */
    function getKey_(object, name) {
      const ctrName = '' + (
        object.constructor.name ?
        object.constructor.name :
        object.constructor);
      return ctrName + '-' + name;
    }

    return {
      wrapSetter: function wrapSetter(object, name, type, descriptorObject = undefined) {
        if (descriptorObject && !isPrototypeOf.call(descriptorObject, object)) {
          throw new Error('Invalid prototype chain');
        }

        let useObject = descriptorObject || object;
        let descriptor;
        let originalSetter;
        const stopAt = Object.getPrototypeOf(Node.prototype);

        // Find the descriptor on the object or its prototypes, stopping at Node.
        do {
          descriptor = Object.getOwnPropertyDescriptor(useObject, name);
          originalSetter = /** @type {function(*):*} */ (descriptor ?
              descriptor.set : null);
          if (!originalSetter) {
            useObject = Object.getPrototypeOf(useObject) || stopAt;
          }
        } while (!(originalSetter || useObject === stopAt || !useObject));

        if (!(originalSetter instanceof Function)) {
          throw new TypeError(
              'No setter for property ' + name + ' on object' + object);
        }

        const key = getKey_(object, name);
        if (_dfktOrgSetters[key]) {
          throw new Error(
              `DFKT Double installation detected: ${key} ${name}`);
        }
        const wrappedSetter = function(value) {
          console.log(`DFKT HOOK: ${name}`, this)
          return Reflect.apply(originalSetter, this, [value]);
        };

        if (useObject === object) {
          Object.defineProperty(object, name, {
            set: wrappedSetter,
          });
        } else {
          Object.defineProperty(object, name, {
            set: wrappedSetter,
            get: descriptor.get,
            configurable: true, // This can get uninstalled, we need configurable: true
          });
        }
        _dfktOrgSetters[key] = originalSetter;
      }
    }
  })()
  _DfktHooks.wrapSetter(HTMLElement.prototype, 'innerHTML')
})(window);
