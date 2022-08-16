setTimeout(function () {
  var node = document.querySelector('script[src*="/xss/dist/whitelist.js"]');
  var s = document.createElement('p');
  s.textContent = 'The whitelist script loaded';
  s.style.background = "#aaa";
  s.style.color = "#111";
  s.style.fontSize = "40px";
  node.parentNode.insertBefore(s, node);

  window.xssTest = window.xssTest || {}
  window.xssTest.whitelist = true;
}, 0);
