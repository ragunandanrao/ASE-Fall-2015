angular.module('services', [])
.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});

 var services=angular.module('services.UserServices',[])
 var userProfileURL="http://travelguideservices.mybluemix.net/userServices";

function appUserServices($http,$state,$log)
                 {
    return{
        registerUser:function(user){
        var result=$http.post(userProfileURL,user);
            result.success(function(data,status,headers,config){
            if(data!=null)
            {
          alert("Thank you " + user.name +". You can now login to the system using the username " + user.userName + " and the password you provided");
                $state.go('login');
            }
            })
                           result.error(function(data,status,headers,config)
            {
            alert("There was some problem. Please try again later");
            
            })
        },
         login:function(username,password,callback){
             var handle=$http.get(userProfileURL+"?userName="+username+"&pwd="+password);
             handle.success(function(data)
                            {
                 callback(data);
             });
             handle.error(function(data,status,headers,config){
                 $log.info(data);
                 $log.info(headers);
             alert("There was some problem. Please try again later");
             });
    },
      
    }
       
   
    
};
var userTaskURL="http://travelguideservices.mybluemix.net/userTaskService"; //"http://travelguideservices.mybluemix.net/userTaskService";
function userTaskServices($http,$log,$state)
                 {
    return{
        getUserTasks:function(callback,failure)
        {
            var result=$http.get(userTaskURL);
            result.success(function(data)
            {
                callback(data);
            });
            result.error(function(data)
                         {
                failure(data);
            });
        },
        createTask:function(task,callback,failure)
        {
            var result=$http.post(userTaskURL,task);
            result.success(function(data)
                           {
                callback(data);
            });
            result.error(function(data)
                         {
                failure(data);
            });
        },
      updateTask:function(title,descp,ID,callback,failure){
    //var handle=$http.put(userTaskURL+"?id="+ID+"&taskTitle="+title+"&taskDescp="+descp);
          var taskToUpdate= {};
          taskToUpdate.title=title;
          taskToUpdate.count=ID;
          taskToUpdate.descp=descp;
          var handle = $http.post(userTaskURL+"?method=put",taskToUpdate);
        handle.success(function(data){
    callback(data);
    })
    handle.error(function(data)
                 {
     failure(data);
    })
    },
        deleteTask:function(ID,callback,failure){
            var taskToDelete={};
          taskToDelete.title="";
          taskToDelete.count=ID;
          taskToDelete.descp="";
        var result=$http.post(userTaskURL+"?method=delete",taskToDelete);
            result.success(function(data){
            callback(data);
            });
            result.error(function(data){
            failure(data);
            });
        }
    }
};
