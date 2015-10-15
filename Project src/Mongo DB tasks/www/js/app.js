// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('starter', ['ionic','ngCordova'])

//app.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//
//    }
//
//    if (window.StatusBar) {
//      // org.apache.cordova.statusbar required
//      StatusBar.styleLightContent();
//    }
//   
//  })
//   
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
          templateUrl: 'templates/task.html',
          controller: 'myCtrl'
        }
      }
    })

.state('tabs.register',{
url:'/register',
    views:{
        'Register':{
        templateUrl:'templates/register.html',
            controller:'registrationCtrlr'
        }
    }
});

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/tab/login');
  

})

app.controller('loginCtrl',function($scope,$log,$state,$http){
$scope.gotoTask=function()
{
    var userName=document.getElementById('txt_Uname').value;
    var password= document.getElementById('txt_Pwd').value;
    if(userName!=null && password!=null){
    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  method: "GET",
		  contentType: "application/json"}).then(onGetUserRecord_sucess,onGetUserRecord_failure);
    }
    function onGetUserRecord_sucess(result)
    {
        var usersList=result.data;
        var loggedUserName;
        for(var i=0;i<usersList.length;i++)
        {
         if(usersList[i].userName==userName && usersList[i].pwd==password)
         {
         loggedUserName=usersList[i].name;
             break;
         }
        }
        if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
            $state.go('tabs.task');
        }
    }
    function onGetUserRecord_failure(result)
    {
        alert("There was some issue. Please try again later");
    }

};
    $scope.redirectToRegistration=function()
    {
    $state.go('tabs.register');
    };

})

app.controller('myCtrl',function($scope,$ionicPlatform,$cordovaLocalNotification,$ionicPopup,$ionicModal,$http){
var index;
    $scope.tasks;
    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  method: "GET",
		  contentType: "application/json"}).then(onGetUserTask_sucess,onGetUserTask_failure);
      function onGetUserTask_sucess(result)
      {
if(result!=null && result.data!=null){                    
$scope.tasks=result.data;
    index=($scope.tasks.length!=0)?$scope.tasks.length:1;
}
      }
function onGetUserTask_failure(result)
      {
      
      }
//    $scope.tasks=[
//        {title: 'Task 1',descp:'This task is for studying',count:index++},
//        {title: 'Task 2', descp:'This task is for playing',count:index++},
//        {title: 'Task 3', descp:'This task is for eating',count:index++}
//]
  
$ionicModal.fromTemplateUrl('templates/new-task.html',function(modal){
    $scope.taskModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
     
$ionicModal.fromTemplateUrl('templates/task-info.html',function(modal){
    $scope.showModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
         $ionicModal.fromTemplateUrl('templates/notifications.html',function(modal){
    $scope.notifyModal=modal;},{
    scope: $scope,
    animation: 'slide-in-up'
                              
});
    // Called when the form is submitted
  $scope.createTask = function() {
    task ={};
      task.title=document.getElementById('txt_title').value;
      task.descp=document.getElementById('txt_descp').value;
      task.count=index++;
      $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  data: JSON.stringify(task),
		  method: "POST",
		  contentType: "application/json"}).then(function sucess(result){onCreateUserTask_sucess(result,task);},onCreateUserTask_failure);
      function onCreateUserTask_sucess(result,task)
      {
          alert("The task " +task.title + " has been created");
          $scope.tasks.push(task);
            document.getElementById('txt_title').value='';//Resetting the values.##
      document.getElementById('txt_descp').value='';
           $scope.taskModal.hide();
         
    
      }
function onCreateUserTask_failure(result)
      {
      alert("This task could not be created. Please try again.");
           $scope.taskModal.hide();
   
      }
      
   
  };
    
$scope.updateTask=function(taskToBeUpdated)
{
    if(taskToBeUpdated!=null){  
    for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==taskToBeUpdated.count){
        //$scope.tasks[i]=taskToBeUpdated;
        var changedTitle = document.getElementById("txt_Changed_Title").value.toString();
        var changedDescp = document.getElementById("txt_Changed_Descp").value.toString();
        $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs&q={"count":' +taskToBeUpdated.count +'}',
 data: JSON.stringify( { "$set" : { 'title' : changedTitle, 'descp': changedDescp } } ),	  
method: "PUT",
		  contentType: "application/json"}).then(onUpdateUserTask_sucess,onUpdateUserTask_failure);
      function onUpdateUserTask_sucess(result)
      {
if(result.data!=null){                    
//$scope.tasks[i]=result.data;
   alert("The task " + changedTitle + " has been updated successfully.");    
     $scope.showModal.hide();
}
      }
function onUpdateUserTask_failure(result)
      {
      alert("This task could not be updated. Please try again.");
          
      }
        
        break;
    }
    
        }
    }

};
    $scope.deleteTask =function(taskIdToBeDeleted)
    {
    var taskToBeDeleted=getSelectedTask(taskIdToBeDeleted);
        if(taskToBeDeleted!=null)
        {
                $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks/'+taskToBeDeleted._id.$oid +'?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs',
 method: "DELETE",contentType: "application/json"}).then(onDeleteUserTask_sucess,onDeleteUserTask_failure);
      function onDeleteUserTask_sucess(result)
      {
if(result!=null){ 
    var positionOfTaskInLIst=getPositionOfTask(taskIdToBeDeleted);
    $scope.tasks.splice(positionOfTaskInLIst,1);//Removing deleted element from array.##
   alert("The task " + taskToBeDeleted.title + " has been deleted successfully.");
     //$scope.showModal.hide();
}
      }
function onDeleteUserTask_failure(result)
      {
      alert("This task could not be deletedd. Please try again.");
          
      }
        }

    }

    function getSelectedTask(idOfTaskToBeSelected)
        {
            var selectedTask;
             for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==idOfTaskToBeSelected){
        selectedTask=$scope.tasks[i];
        return selectedTask;
        
    }
    
        }
        
        };
     function getPositionOfTask(idOfTaskToBeSelected)
        {
                     for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==idOfTaskToBeSelected){
       return i;
        
    }
    
        }
        
        };
  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
   // var textDate=document.getElementById('txt_Date');
      //textDate.style.display= "none";
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
      $scope.showModal.hide();
  };
    $scope.showPopUp=function(valueOfTaskToBeSelected)
    {
       
 
        if(valueOfTaskToBeSelected!=undefined && valueOfTaskToBeSelected!=null)
        {
    $scope.selectedTask=getSelectedTask(valueOfTaskToBeSelected);
        if($scope.selectedTask!=null)
                   $scope.showModal.show();
        }
    };
       
        $scope.showNotification =function(taskId){ 
            if(taskId!=undefined && taskId!=null)
            $scope.selectedTask=getSelectedTask(taskId);
            $scope.notifyModal.show();
       };
         $scope.closeModal=function()
    {
       $scope.notifyModal.hide();
    };
    $ionicPlatform.ready(function() {
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
			var dateToBeSet=document.getElementById('txt_date').value.toString();
			var timeToSet=document.getElementById('txt_time').value.toString();
			var dateAndTimeToBeSet=dateToBeSet +" " + timeToSet + ":00"; //By default adding the milli seconds as 0.##
       dateAndTimeToBeSet =new Date(dateAndTimeToBeSet);
            var now = new Date().getTime(),
			_10_seconds_from_now = new Date(now + 10*1000);
			
			$cordovaLocalNotification.isScheduled(task.count).then(function(isScheduled) {
				if (isScheduled){
					$ionicPopup.alert({
						title: "Warning",
						template: "Notification with this ID is already scheduled"
					}).then(function(result) {
						//task.id = "";
					});
				}else{
					$cordovaLocalNotification.add({
						id:      task.count,
						title:   'Notification',
						message: task.descp,
						repeat:  'daily',
						date:    dateAndTimeToBeSet
					});
					
					$ionicPopup.alert({
						title: "Done",
						template: "Your notification set for " + dateAndTimeToBeSet+ " seconds from now."
					}).then(function(result) {
						$scope.notifyModal.hide();
						$scope.getNotificationIds();
						//task.id = "";
                     //  $scope.messagesStore[$scope.messagesStore.length]=task.msg;
						//task.msg = "";
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
     
})
app.controller('registrationCtrlr',function($scope,$state,$http){

    $scope.completeRegistration=function()
{
        var userRecord={};
         userRecord.name=document.getElementById('txt_name').value;
        userRecord.userName=document.getElementById('txt_uname').value;
        userRecord.pwd=document.getElementById('txt_pwd').value;
        userRecord.mobile=document.getElementById('txt_mobile').value;
        
        
$http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
		  data: JSON.stringify(userRecord),
		  method: "POST",
		  contentType: "application/json"}).then(function sucess(result){onUserRecord_sucess(result,userRecord);},function failure(result){onUserRecord_failure;});

}
    function onUserRecord_sucess(result,userRecord)
    {
    alert("Thank you " + userRecord.name +". You can now login to the system using the username " + userRecord.userName + " and the password you provided");
    $state.go('tabs.login');
    }
    function onUserRecord_failure(result)
    {
    alert("There was some issue signing you up. Please try again after some time.");
    }


});
