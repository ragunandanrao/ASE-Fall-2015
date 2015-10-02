describe('loginCtrl', function(){
    var scope;//we'll use this scope in our tests
 var state;
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('starter'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller,$state){
        //create an empty scope
        scope = $rootScope.$new();
       state=$state;
        //declare the controller and inject our empty scope
        $controller('loginCtrl', {$scope: scope},{$state:state});
    }));
     it('should check if service has been implemented properly to handle success and failure',function()
    {
        expect(scope.$on.length).toEqual(2);
    });
    it("should check if the user is being redirected to the login page on load",function()
       {
        expect(state.$current.url.source.toString()).toEqual('/tab/login.html');
    });
});

describe('myCtrl',function(){
beforeEach(angular.mock.module('starter'));
    beforeEach(angular.mock.inject(function($rootScope,$controller,_FreshlyPressed_,$http,$state,$log){
        var freshlyPressed=_FreshlyPressed_;
    scope=$rootScope.$new();
     var http=$http;
         $controller('myCtrl', {$scope: scope},{FreshlyPressed:freshlyPressed},$log,$state);
         $http.jsonp("https://public-api.wordpress.com/rest/v1.1/freshly-pressed?callback=JSON_CALLBACK").success(function(result){
        scope.posts=result.posts;
             })
    }));
    it("should check for the function response not null",function(){
   expect(scope.posts.length).not.toEqual(0);
    
                                                                                                                   
          
    });
});