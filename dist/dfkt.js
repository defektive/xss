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
  
  if (!window.elProto) {
    window.elProto = Object.getPrototypeOf(HTMLElement);
    window.elInnerHTML = Object.getOwnPropertyDescriptor(window.elProto, 'innerHTML');

    Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
      set: function (hotmail){
        _c.warn(`${this}.innerHTML is being called`)
        window.elInnerHTML.set.call(this, val)
      },

      get: function () {
        window.elInnerHTML.get.call(this)
      }
    });
  }
})(window);
