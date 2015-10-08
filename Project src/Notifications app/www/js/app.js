// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('starter', ['ionic', 'ngCordova'])
//
//app.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//
//    }
//    if (window.StatusBar) {
//      // org.apache.cordova.statusbar required
//      StatusBar.styleLightContent();
//    }
//  });
//})
app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
  .state('tabs.login',{
  url:'/login',
        views: {
        'Login': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
     
  })
  .state('tabs.task',{
        url:'/task',
          views: {
        'Task': {
          templateUrl: 'templates/notify.html',
          controller: 'NotifyCtrl'
        }
      }
    });
  

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/tab/login');
  

})

app.controller('loginCtrl',function($scope,$log,$state){
$scope.gotoTask=function()
{
$state.go('tabs.task');
}
})
app.controller('NotifyCtrl',function($scope,$ionicPlatform,$cordovaLocalNotification,$ionicPopup,$ionicModal)
               {
    $scope.messagesStore=new Array();
    $ionicModal.fromTemplateUrl('new-notify.html',function(modal){
    $scope.notifyModal=modal;
    },{
        scope:$scope,
        animation:'slide-in-up'
    });
    $scope.openModal =function()
    {
        $scope.notifyModal.show();
    };
    $scope.closeModal=function()
    {
       $scope.notifyModal.hide();
    };
$ionicPlatform.ready(function(){

$scope.getNotificationIds = function () {
			$cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
				
				$scope.result = [];
				
				for(var key in scheduledIds) {
                    if(scheduledIds[key]!=null){
					var row = {'id': scheduledIds[key]};
                    $scope.result.push(row);
                    }
				}
			});
		};
    
    
$scope.getNotificationIds();
   $scope.addNotification = function (task) {
			var now              = new Date().getTime(),
			_10_seconds_from_now = new Date(now + 10*1000);
			
			$cordovaLocalNotification.isScheduled(task.id).then(function(isScheduled) {
				if (isScheduled){
					$ionicPopup.alert({
						title: "Warning",
						template: "Notification with this ID is already scheduled"
					}).then(function(result) {
						task.id = "";
					});
				}else{
					$cordovaLocalNotification.add({
						id:      task.id,
						title:   'Notification',
						message: task.msg,
						repeat:  'daily',
						date:    _10_seconds_from_now
					});
					
					$ionicPopup.alert({
						title: "Done",
						template: "Your notification set for " + _10_seconds_from_now + " seconds from now."
					}).then(function(result) {
						$scope.notifyModal.hide();
						$scope.getNotificationIds();
						task.id = "";
                        $scope.messagesStore[$scope.messagesStore.length]=task.msg;
						task.msg = "";
					});
				}
			});
		};
    $scope.cancelNotification = function (id) {
			$cordovaLocalNotification.cancel(id).then(function () {
				alert('Callback for cancellation background notification'); // never get called
			});
			
			$ionicPopup.alert({
				title: "Done",
				template: "Notification " + id + " is cancelled"
			}).then(function(res) {
				$scope.getNotificationIds();
			});
			
		};
});
});

