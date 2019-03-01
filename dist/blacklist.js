setTimeout(function () {
  var node = document.querySelector('script[src*="/xss/dist/blacklist.js"]');
  var s = document.createElement('p');
  s.textContent = 'The blacklist script loaded';
  s.style.background = "#000";
  s.style.color = "#f00";
  s.style.fontSize = "40px";
  node.parentNode.insertBefore(s, node);

  window.xssTest = window.xssTest || {}
  window.xssTest.blacklist = true;
}, 0);
