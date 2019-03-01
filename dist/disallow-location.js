(function (window){
  let ogLocation = window.location;
  Object.defineProperty(window, 'location', {
    set: function(new_webpackFunction) {
      console.log('nope')
      return ogLocation;
    },
    get: function () {
      return ogLocation;
    }
  });
})(window);
