# [XSS](/xss/) / Post Message Log

<pre id="asd"></pre>
<script>
window.addEventListener("message", function () {
  let str = Array.prototype.join.apply(arguments, [' ']);
  let el = document.createTextNode(`${str}\n`);
  document.getElementById('asd').appendChild(el);
}, false);
</script>
