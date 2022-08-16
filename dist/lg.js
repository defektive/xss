(function () {
  var logEl = document.getElementById('xss-console-log');
  if (!logEl) {
    logEl = document.createElement('pre');
    var node = document.querySelector('script[src*="dist/lg.js"]');
    node && node.parentNode.insertBefore(logEl, node) || document.body.appendChild(logEl);
  }

  window._dfktLog = function () {
    let str = Array.prototype.join.apply(arguments, [' ']);
    let el = document.createTextNode(`${str}\n`);
    logEl.appendChild(el);

    Array.prototype.unshift.apply(arguments, ['DFKT'])
    console.log.apply(console, arguments);
  }
})();
