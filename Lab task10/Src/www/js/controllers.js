angular.module('starter.controllers', ['ionic','services.UserServices'])

.controller('LanguageTranslatorController', function($scope) {
   $scope.convertText =function()
          {
           var SourceText= document.getElementById("SourceText").value.toString();
           var SourceLanguage = document.getElementById("SourceLanguage");
           SourceLanguage=SourceLanguage.options[SourceLanguage.selectedIndex].value;
            var DestinationText=document.getElementById("DestinationText").value.toString();
            var DestinationLanguage = document.getElementById("DestinationLanguage");
            DestinationLanguage =DestinationLanguage.options[DestinationLanguage.selectedIndex].value;
              $.ajax({
		url: 'http://www.frengly.com/',		
		data: {
			src: SourceLanguage,
			dest: DestinationLanguage,
			text: SourceText,
			outformat: 'json',
			email: "pradeepchaitu1992@gmail.com",
			password: "9989807198"
		},			    	    	    
		success: function(data){
           document.getElementById("DestinationText").value=data.translation;
		},
		error: function (errormessage) {
			 $('#responseDiv').html(errormessage);
		}
	});	
};
})
 .controller('googlemapoutput', function ($scope,$http) {
  
    $scope.getWeather = function() {       
     var location = document.getElementById("searchLocation").value;
        $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+location+'&mode=json&units=metric&cnt=7&appid=6592931011456bf7e824174e29720be8')
.success(function(sourcedata){
            graphArea.innerHTML=" ";
            currentWeather.innerHTML= "<center>"+sourcedata.city.name+
                                           "<br><br>"+sourcedata.list[0].temp.min+"<sup>o</sup> C<br>"
                                            +sourcedata.list[0].weather[0].main+"</center>";
            var cityName = sourcedata.city.name;
            var longitude = sourcedata.city.coord.lon;
            var latitude = sourcedata.city.coord.lat;
            var myArray = [];
            for(var i=0;i<sourcedata.list.length;i++)
                {
                    myArray.push({           
                    dt: timeConverter(sourcedata.list[i].dt),
                    min:sourcedata.list[i].temp.min,
                    max:sourcedata.list[i].temp.max,
                   //humidity:sourcedata.list[i].humidity
                    Main:sourcedata.list[i].weather[0].main
                    });
//                 alert(myArray[i]);
                 }
    graph(myArray);   

function timeConverter(UNIX_timestamp){
    var date = new Date(UNIX_timestamp*1000);
    var years = date.getFullYear();
    var month = date.getMonth() +1;
    var mydate = date.getDate();
    var formattedTime = years + '-' + month + '-' + mydate;        
    return ''+formattedTime+'';   
}
     
function graph(myArray){
     Morris.Line({
        element:'graphArea',
        data: myArray,
        xkey:"dt",
        ykeys:['min', 'max'],
        lineColors:['blue','red'],
        lineWidth:1,
        pointSize:2,
        grid:false,
   //   pointFillColors:['white'],
        labels: ['Minimum', 'Maximum']
     });    
}
console.log(sourcedata);
})       
.error(function(error){
       
})
};    
})
.controller('loginCtrl', function($scope, $state, $q, UserService, $ionicLoading,$log,$state,$http,$cordovaOauth) {
     var loggedUserName;
     var userServicesFactory;
    if(userServicesFactory==undefined || userServicesFactory==null)
   userServicesFactory= getServiceFactory($http,$state,$log);
        var userServices = userServicesFactory.createService("user");
    $scope.goToHome=function()
{
        if(document.getElementById('txt_Uname')){
    $scope.userName=document.getElementById('txt_Uname').value;
      
       // ;
        }
        
          if(document.getElementById('txt_Pwd')){
    $scope.password= document.getElementById('txt_Pwd').value;
       //
          }
    if($scope.userName!=null && $scope.password!=null){
//    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
//		  method: "GET",
//		  contentType: "application/json"}).then(onGetUserRecord_sucess,onGetUserRecord_failure);
        $ionicLoading.show({
          template: 'Logging in...'
        });
        
        userServices.login($scope.userName,$scope.password,onGetUserRecord_sucess);
    }
    function onGetUserRecord_sucess(result)
    {
        $scope.usersList=result;
       
       
         loggedUserName=$scope.usersList.name; 
        
        if(loggedUserName!=null){
             document.getElementById('txt_Uname').value="";
     document.getElementById('txt_Pwd').value="";
             $ionicLoading.hide();
        alert("Welcome " + loggedUserName );
            userLoginMode = 'local';
           
           // $state.go('tabs.task');
            $state.go('main.dashboard.home');
        }
    }
//    function onGetUserRecord_failure(result)
//    {
//        alert("There was some issue. Please try again later");
//    }

};
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
     loggedUserName = profileInfo.name;
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=small"
      });
      $ionicLoading.hide();
      if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
           userLoginMode = 'fb';
            $state.go('main.dashboard.home');
        }
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    $log.info('fbLoginError'+ error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				$log.info(response);
        info.resolve(response);
      },
      function (response) {
				$log.info(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');
            $log.info(JSON.stringify(user));
    		if(!user.userID){
                $log.info(JSON.stringify(user.userID));
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						loggedUserName = profileInfo.name;
                    $log.info(loggedUserName);
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
           userLoginMode = 'fb';
            $state.go('main.dashboard.home');
        }
					}, function(fail){
						// Fail get profile info
						$log.info('profile info fail'+ fail);
					});
				}else{
                    loggedUserName = user.name;
                    if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
          userLoginMode = 'fb';
            $state.go('main.dashboard.home');
        }
					
				}
      } else {
            $log.info('getLoginStatus'+ success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
       
$scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
          
          loggedUserName=user_data.displayName;
//        UserService.setUser({
//          userID: user_data.userId,
//          name: user_data.displayName,
//          email: user_data.email,
//          picture: user_data.imageUrl,
//          accessToken: user_data.accessToken,
//          idToken: user_data.idToken
//        });
 if(loggedUserName!=null){
        alert("Welcome " + loggedUserName );
     userLoginMode='google';
            $ionicLoading.hide();
        $state.go('main.dashboard.home');
        }
     
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };

    $scope.redirectToRegistration=function()
    {
    $state.go('register');
    };
})


app.controller('taskCtrlr',function($scope,$ionicPlatform,$cordovaLocalNotification,$ionicPopup,$ionicModal,$http,$state,$log){
   var userTaskFactory;
    if(userTaskFactory==undefined && userTaskFactory==null)
   userTaskFactory= getServiceFactory($http,$state,$log);
        var userTaskServices = userTaskFactory.createService("userTask");
    $scope.tasks;
//    $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
//		  method: "GET",
//		  contentType: "application/json"}).then(onGetUserTask_sucess,onGetUserTask_failure);
    userTaskServices.getUserTasks(onGetUserTask_sucess,onGetUserTask_failure);
      function onGetUserTask_sucess(result)
      {
if(result!=null && result!="Failure"){                    
$scope.tasks=result;
    
}
      }
function onGetUserTask_failure(result)
      {
      alert("There was some error. Please try again");
      }
  
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
      var ID=assignIdToTask();
      task.title=document.getElementById('txt_title').value;
      task.descp=document.getElementById('txt_descp').value;
      task.count=ID;
//      $http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
//		  data: JSON.stringify(task),
//		  method: "POST",
//		  contentType: "application/json"}).then(function sucess(result){onCreateUserTask_sucess(result,task);},onCreateUserTask_failure);
      userTaskServices.createTask(task,onCreateUserTask_sucess,onCreateUserTask_failure);
      function onCreateUserTask_sucess(result)
      {
          alert("The task " +task.title + " has been created");
          if($scope.tasks==undefined){
          $scope.tasks= [{}];
              $scope.tasks.push(task);
              $scope.tasks.splice(0,1);
          }
          else{
          $scope.tasks.push(task);
          }
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
 function assignIdToTask()
  {
      var x= Math.floor((Math.random() * 200) + 1);
      var y= Math.floor((Math.random() * 10) + 1);
      var z= Math.floor((Math.random() * 10) + 1);
      var Id = (x*y) - z;
      return Id;
  };
$scope.updateTask=function(taskToBeUpdated)
{
    if(taskToBeUpdated!=null){  
    for (var i=0;i<$scope.tasks.length;i++){
    if($scope.tasks[i].count==taskToBeUpdated.count){
        //$scope.tasks[i]=taskToBeUpdated;
        var changedTitle = document.getElementById("txt_Changed_Title").value.toString();
        var changedDescp = document.getElementById("txt_Changed_Descp").value.toString();
//        $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs&q={"count":' +taskToBeUpdated.count +'}',
// data: JSON.stringify( { "$set" : { 'title' : changedTitle, 'descp': changedDescp } } ),	  
//method: "PUT",
//		  contentType: "application/json"}).then(onUpdateUserTask_sucess,onUpdateUserTask_failure);
//        appUserServices.updateTask(changedTitle,changedDescp,taskToBeUpdated.count,onUpdateUserTask_sucess);
userTaskServices.updateTask(changedTitle,changedDescp,taskToBeUpdated.count,onUpdateUserTask_sucess,onUpdateUserTask_failure);
      function onUpdateUserTask_sucess(result)
      {
if(result!=null){                    
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
//                $http( { url: 'https://api.mongolab.com/api/1/databases/travelguide/collections/userTasks/'+taskToBeDeleted._id.$oid +'?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs',
// method: "DELETE",contentType: "application/json"}).then(onDeleteUserTask_sucess,onDeleteUserTask_failure);
            userTaskServices.deleteTask(taskToBeDeleted.count,onDeleteUserTask_sucess,onDeleteUserTask_failure);
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
      alert("This task could not be deleted. Please try again.");
          
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
						template: "Your notification set for " + dateAndTimeToBeSet
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
app.controller('registrationCtrlr',function($scope,$state,$http,$log,$cordovaFileTransfer,$ionicLoading){
  var userServicesFactory;
    var API_URL = "https://gateway.watsonplatform.net/visual-recognition-beta/api";
var API_USER = "dfab3d3f-d4d0-44cf-a516-fa22f83ebdda";
var API_PASSWORD = "NR10gnp3Q7aF";
    if(userServicesFactory==undefined || userServicesFactory==null)
   var userServicesFactory= getServiceFactory($http,$state,$log);
        var userServices = userServicesFactory.createService("user");
    $scope.completeRegistration=function()
{
        var userRecord={};
         userRecord.name=document.getElementById('txt_name').value;
        userRecord.userName=document.getElementById('txt_uname').value;
        userRecord.pwd=document.getElementById('txt_pwd').value;
        userRecord.mobile=document.getElementById('txt_mobile').value;
        if(userRecord!=null && userRecord.name!=null && userRecord.userName!=null && userRecord.pwd!=null)
        userServices.registerUser(userRecord);


    }
    $scope.goToLogin =function(){
     $state.go('login');
    }
    
     function uploadWin(res) {
       // alert("The start of the method is hit");
         var humanCaptchaFlag=false;
         var result;
        var data = JSON.parse(res.response);
        var labels = data.images[0].labels;
         if(labels!=undefined && labels!=null && labels.length>0){
        for(var len=0; len<labels.length;len++) {
            result += "<b>"+labels[len].label_name + "</b><br/>";  
            if(labels[len]!=undefined && labels[len]!=null && labels[len].label_name!=null){
            if(labels[len].label_name.toString().toUpperCase()=="FACE" || labels[len].label_name.toString().toUpperCase()=="HUMAN")
            {
                humanCaptchaFlag=true;
            }
            }
        }
         }
         if(humanCaptchaFlag)
         {
             if(document.getElementById('btn_SignUp').classList.contains('hide'))
             {
                 alert('From your image it seems you are not a robot');
             document.getElementById('btn_SignUp').classList.remove('hide');
             document.getElementById('btn_Camera').classList.add('hide');
                 $("#userImage").hide();
             }
             
         }
         else
         {
             alert("You are either an alien or robot. Please retry");
         }
           $ionicLoading.hide();
        console.log(result); 
        //$("#status").html(result);
    }
    
    function uploadFail(message) {
        alert("Upload failed" + message);
         $ionicLoading.hide();
        console.log(JSON.stringify(message));
        console.dir(arguments);
    }
    
    //Credit: http://stackoverflow.com/a/14313052/52160
    function authHeaderValue(username, password) {
        var tok = username + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    };
    
	function onCamSuccess(imageData) {
		var image = document.getElementById('myImage');
        $("#userImage").attr("src", imageData);
        $("#userImage").css("height","200px");
        $("#userImage").css("width","200px");

       // $("#status").html("<i>Uploading picture for BlueMix analysis...</i>");
        $ionicLoading.show({
                    template:'<img src="img/imageProcesing.gif">'     //'Please wait we are analyzing your pic...'
                });
        var options = new FileUploadOptions();
        options.fileKey = "img_file";
        options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
        options.chunkedMode=false;
        options.headers = {'Authorization': authHeaderValue(API_USER, API_PASSWORD) };
        options.mimeType = "image/jpg";
        var ft = new FileTransfer();
        var url = encodeURI(API_URL+"/v1/tag/recognize");
        //alert("Uname = " + API_USER + "  password= " + API_PASSWORD + " hashedValue = "+ options.headers );
        ft.upload(imageData, url, uploadWin, uploadFail, options);
        //$cordovaFileTransfer.upload(imageData, url, options).then(uploadWin, uploadFail);

    }

	function onCamFail(message) {
		alert('Failed because: ' + message);
	}	
    
    //Touch handlers for the two buttons, one uses lib, one uses cam
    $scope.pictureCollect =  function($event) {
        var source =Camera.PictureSourceType.CAMERA;
        
		navigator.camera.getPicture(onCamSuccess, onCamFail, { 
			quality: 50,
			sourceType: source,
			destinationType: Camera.DestinationType.FILE_URI
		});

    };
        $scope.getImageResults = function() {
            var searchURL = document.getElementById('txt_URL').value;
            if(searchURL!=null){
        var url= 'http://userinteractionservice.mybluemix.net/api/Alchemy/search/URLGetRankedImageFaceTags/'+searchURL;
        console.log(url);
                
        $http.get(url) 
            .success(function(data) { 
                console.log(data);
                if(data!=null && data.gender!=null)
                {
                    if((data.gender.toUpperCase()=="MALE" || data.gender.toUpperCase()=="FEMALE"))
                    {                    
                        var gender = data.gender.toString();
                        var ageRange = data.ageRange.toString();
                        if(ageRange!=null)
                        alert('You are a' + gender + 'between' + ageRange.split('-')[0]+'and'+ ageRange.split('-')[0] +'years. Please proceed with signup.');
                    }
                    else 
                    {
                        alert('You are either a robot or alien.');
                    }
                }
            }) 
            .error(function(err) { 
                console.log("data not received from url");
            }); 
            }
        }
   
})

app.controller('homeCtrlr',function($scope,$scope, UserService, $ionicActionSheet, $state, $ionicLoading,$log,$ionicHistory)
               {
$scope.openTasksToDo = function()
{
$state.go('main.dashboard.task');
}
$scope.showWeather = function()
{
$state.go('main.dashboard.weather');
}
$scope.showTranslate=function()
{
$state.go('main.dashboard.translator');
}


$scope.user = UserService.getUser();
    
$scope.userLogout = function()
{
     $log.info("The controller method 1 has been called");
    
    if(userLoginMode!=null)
    {
        $log.info(userLoginMode);
        if(userLoginMode=='fb'){
            $scope.showFBLogOutMenu();
            
        }
        else if(userLoginMode=='local')
        {
        $scope.showLogoutMenu();
        }
        else if(userLoginMode=='google')
        {
            $scope.showGoogleLogoutMenu();
            
     
        }
    }
}


	$scope.showFBLogOutMenu = function() {
        $log.info('The controller has been directed to');
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

        // Facebook logout
        facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
            userLoginMode="";
          $state.go('login');
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		});
	}
    $scope.showGoogleLogoutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
					template: 'Logging out...'
				});
				// Google logout
				window.plugins.googleplus.logout(
					function (msg) {
						$log.info(msg);
						$ionicLoading.hide();
						$state.go('login');
					},
					function(fail){
						$log.info(fail);
					}
				);
			}
		});
	};
    
    $scope.showLogoutMenu =function()
    {
        $log.info("The lgout method is being hit");	
        var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
                $log.info('The button click is working');
				return true;
			},
			destructiveButtonClicked: function(){
				$log.info('The popup is shown');
                $ionicLoading.show({
				  template: 'Logging out...'
				});

       userLoginMode="";
                 $ionicLoading.hide();
          $state.go('login');
                //$ionicHistory.goBack();
                $log.info('The redirection logic is working');
			}
		})
    };

})
app.controller('tabsContrlr',function($scope,$state,$log)
               {
$scope.goToHome=function()
{
$state.go('main.dashboard.home');
}
});

        
//$http( { url: "https://api.mongolab.com/api/1/databases/travelguide/collections/users?apiKey=1iwTCrjgXRLz-tbL9nznRtZRB5K9p_Zs",
//		  data: JSON.stringify(userRecord),
//		  method: "POST",
//		  contentType: "application/json"}).then(function sucess(result){onUserRecord_sucess(result,userRecord);},function failure(result){onUserRecord_failure;});
//
//}
//    function onUserRecord_sucess(result,userRecord)
//    {
//    alert("Thank you " + userRecord.name +". You can now login to the system using the username " + userRecord.userName + " and the password you provided");
//    $state.go('tabs.login');
//    }
//    function onUserRecord_failure(result)
//    {
//    alert("There was some issue signing you up. Please try again after some time.");
//    }