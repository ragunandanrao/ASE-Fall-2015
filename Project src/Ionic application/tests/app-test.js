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
