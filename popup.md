## Popup Information

<p>
<script src="dist/lg.js"></script>
</p>


<script>
let logger = window._dfktLog || console.log;
// put this here to fix highlighting_
  window.addEventListener("message", function (e) {
    logger(e.data);
  }, false);

  if (window.opener) {
    logger('window.opener is set');

    setInterval(function (){
      logger('sending message');
      window.opener.postMessage('hey there from xss', 'http://xss-test.docker');
    }, 5000)

  } else {
    logger('window.opener is NOT set');
  }
</script>
