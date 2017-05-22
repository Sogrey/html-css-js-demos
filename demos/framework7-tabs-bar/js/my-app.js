// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4');


//http://framework7.taobao.org/tutorials/maintain-both-ios-and-material-themes-in-single-app.html#.WR_ldtx96Cg

//// Determine theme depending on device
//var isAndroid = Framework7.prototype.device.android === true;
//var isIos = Framework7.prototype.device.ios === true;
// 
//// Set Template7 global devices flags
//Template7.global = {
//  android: isAndroid,
//  ios: isIos
//};
// 
//// Define Dom7
//var $$ = Dom7;
// 
//// Add CSS Styles
//if (isAndroid) {
//  $$('head').append(
//      '<link rel="stylesheet" href="./css/framework7.material.min.css">' +
//      '<link rel="stylesheet" href="./css/framework7.material.colors.min.css">' +
//      '<link rel="stylesheet" href="./css/my-app.css">'
//  );
//}
//else {
//  $$('head').append(
//      '<link rel="stylesheet" href="./css/framework7.ios.min.css">' +
//      '<link rel="stylesheet" href="./css/framework7.ios.colors.min.css">' +
//      '<link rel="stylesheet" href="./css/my-app.css">'
//  );
//}
// 
//// Change Through navbar layout to Fixed
//if (isAndroid) {
//  // Change class
//  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
//  // And move Navbar into Page
//  $$('.view .navbar').prependTo('.view .page');
//}
// 
//// Init App
//var myApp = new Framework7({
//  // Enable Material theme for Android device only
//  material: isAndroid ? true : false,
//  // Enable Template7 pages
//  template7Pages: true
//});
// 
//// Add views
//var view1 = myApp.addView('#view-1');
//var view2 = myApp.addView('#view-2', {
//  // Because we use fixed-through navbar we can enable dynamic navbar
//  dynamicNavbar: true
//});
//var view3 = myApp.addView('#view-3');
//var view4 = myApp.addView('#view-4');