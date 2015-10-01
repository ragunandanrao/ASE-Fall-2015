// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var App=angular.module('starter', ['ionic','directive.g+signin'])
App.service("FreshlyPressed",["$http","$log",FreshlyPressed]);

App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
App.config(function($stateProvider, $urlRouterProvider){
$stateProvider.state('tabs',{
url:'/tab',
    abstract: true,
      templateUrl: "templates/tabs.html"
})
.state('tabs.login', {
      url: '/login',
      views: {
        'Login': {
          templateUrl: "templates/login.html",
          controller: 'loginCtrl'
        }
      }
    })
.state('tabs.home',{
url:'/home',
    views:{
        'Login':{
    templateUrl:'templates/home.html',
    controller:'myCtrl'
        }
    }
})
 $urlRouterProvider.otherwise("/tab/login");
})

App.controller('myCtrl',function($scope,FreshlyPressed, $log,$state){
    $scope.posts=[];
$scope.refresh=function()
{    
    FreshlyPressed.getBlogs($scope);
}
 $scope.logout=function()
    {
       $scope.authResult="";
    $state.go('tabs.login'); 
    
    }
})
App.controller('loginCtrl',function($scope,$state){
    if($scope!=null && $scope.$on!=null){
$scope.$on('event:google-plus-signin-success', function (event,authResult,googleUser) {
    if(authResult!=undefined && authResult!=null){
 $state.go('tabs.home');
        
    }
    
  });
  $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
    if(authResult!=undefined && authResult!=null && authResult['error']!="immediate_failed")
      alert("login failed");
  });
    }
   
})
function FreshlyPressed($http,$log)
{
    this.getBlogs=function($scope){
        $http.jsonp("https://public-api.wordpress.com/rest/v1.1/freshly-pressed?callback=JSON_CALLBACK").success(function(result){
           $scope.posts=result.posts; 
            $log.info(JSON.stringify(result.posts));
            $scope.$broadcast("scroll.refreshComplete");
        });
    };
};
