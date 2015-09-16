angular.module('Lets chat', [])
.controller('friendLocator', function ($scope,$http,$sce) {

    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        if (typeof(Storage) !== "undefined") {
        localStorage.setItem("Username","ragunandanrao@gmail.com");
            localStorage.setItem("pwd","raghu");
        }
        var pos = new google.maps.LatLng(0, 0); 
          var mapOptions = {
                zoom: 3,
                center: pos
            };

            map = new google.maps.Map(document.getElementById('friendFinderMap'),
            mapOptions);
     };

    $scope.calcRoute = function () {
       var end = document.getElementById('Destination').value;
            var start = document.getElementById('Source').value;

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                   directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                    console.log(status);
                      $http.get(   'http://api.wunderground.com/api/36b799dc821d5836/conditions/q/'+start+'.json').success(function(data) {
      console.log(data);
          temp = data.current_observation.temp_f;
                icon = data.current_observation.icon_url;
                weather = data.current_observation.weather;
             console.log(temp);
                          $scope.sourceWeather =$sce.trustAsHtml("<p>The weather at " +start.toUpperCase()+ " is : <br/>Currently " +temp +" &deg; F and " + weather + "</p>");
                $scope.sourceIcon=  $sce.trustAsHtml("<img src='" + icon  +"'/>");
                          $http.get(   'http://api.wunderground.com/api/36b799dc821d5836/conditions/q/'+end+'.json').success(function(data) {
      console.log(data);
          temp = data.current_observation.temp_f;
                icon = data.current_observation.icon_url;
                weather = data.current_observation.weather;
             console.log(temp);
    
                      $scope.destinationweather =$sce.trustAsHtml("<p>The weather at " +end.toUpperCase()+ " is : <br/>Currently " +temp +" &deg; F and " + weather + "</p>")
                $scope.destinationIcon =  $sce.trustAsHtml("<img src='" + icon  +"'/>");        
                         
});
                
                     
                          
});
                   }
               
           
        });
      
    };

    google.maps.event.addDomListener(window, 'load', $scope.initialize);
    

});

function login()
{
var uname = document.getElementById("txt_uname").value.toString();
    var password = document.getElementById("txt_Pwd").value.toString();
    if(uname == localStorage.getItem("Username") && password == localStorage.getItem("pwd"))
    {
    alert("Username and password have matched");
    }
    
       
    
}
