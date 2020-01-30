// Generated by LiveScript 1.5.0
(function(){
  var getPrimaryCoin, themes, defaultLogo;
  getPrimaryCoin = require('./get-primary-coin.js');
  themes = require('./themes.js');
  defaultLogo = "data:image/png;base64,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";
  module.exports = function(store){
    var coin, branding, ref$, ref1$, ref2$, links, color, app;
    coin = getPrimaryCoin(store);
    branding = {
      logo: (ref$ = coin != null ? (ref1$ = coin.branding) != null ? ref1$.logo : void 8 : void 8) != null ? ref$ : defaultLogo,
      title: (ref$ = coin != null ? (ref2$ = coin.branding) != null ? ref2$.title : void 8 : void 8) != null ? ref$ : "WALLET"
    };
    links = (ref$ = coin != null ? coin.links : void 8) != null
      ? ref$
      : [];
    color = (ref$ = coin != null ? coin.color : void 8) != null ? ref$ : "#000000";
    app = (ref$ = themes[store.theme]) != null
      ? ref$
      : themes.dark;
    return {
      app: app,
      branding: branding,
      links: links,
      color: color
    };
  };
}).call(this);