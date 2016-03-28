angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, Station, currentPosition, $ionicLoading) {
    $scope.stations = [];
    $scope.closest = null;
    $scope.display_closest = false;
    $scope.position = {
        lat : "",
        lng : "",
        acc : ""
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };
    $scope.show = function() {
        $ionicLoading.show({
            template: 'Nous retournons ciel et terre...'
        });
    };
    
    // JCDecaux API
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=Nancy&apiKey=95e5acf87a6d77ccb0c6b212a411b3deab05b8d9";
    
    // Get all the stations
    $http.get(url).then(function(response){
        response.data.forEach(function(single){
            single.last_update = new Date(single.last_update);
            $scope.stations.push(new Station(single));
            
        });
        console.log($scope.stations);
    });
    

    $scope.locate = function(){

        $scope.show();
        document.addEventListener("deviceready", onDeviceReady, false);

        // Cordova is ready
        //
        function onDeviceReady() {
            console.log("navigator.geolocation works well");
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
        }

        // onSuccess Geolocation
        //
        function onSuccess(position) {
            // var element = document.getElementById('geolocation');
            // alert('Latitude: '         + position.coords.latitude              + '\n' +
            //     'Longitude: '          + position.coords.longitude             + '\n' +
            //     'Altitude: '           + position.coords.altitude              + '\n' +
            //     'Accuracy: '           + position.coords.accuracy              + '\n' +
            //     'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
            //     'Heading: '            + position.coords.heading               + '\n' +
            //     'Speed: '              + position.coords.speed                 + '\n' +
            //     'Timestamp: '          + position.timestamp                    + '\n'
            // );

            $scope.position.lat = position.coords.latitude;
            $scope.position.lng = position.coords.longitude;
            $scope.position.acc = position.coords.accuracy;
            currentPosition.position = $scope.position;

            $scope.closest = getClosest();
            console.log($scope.closest);
            $scope.display_closest = true;
            $scope.hide();
        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            $scope.hide();
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }
    };

    /**
     * Calculate the distance between 2 points
     * @param lat1 "First point latitude"
     * @param lon1 "First point longitude"
     * @param lat2 "Second point latitude"
     * @param lon2 "Second point longitude"
     * @param unit "The unit of the returned value, can be 'K'ilometers ...
     * @returns {number}
     */
    var distance = function(lat1, lon1, lat2, lon2, unit) {
        unit = "K";
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344; }
        if (unit == "M") { dist = dist * 1.609344 * 1000; }
        if (unit == "N") { dist = dist * 0.8684; }
        return dist
    }

    /**
     * Return the closest tram station
     * @param latitude "Your latitude"
     * @param longitude "Your longitude"
     * @return {arret}
     */
    var getClosest = function() {
        // var request = new XMLHttpRequest();
        // request.open("GET", "./arrets.json", false);
        // request.send(null);
        // var arrets = JSON.parse(request.responseText);
        var dist = 1000;
        var closestStation;
        $scope.stations.forEach(function (station) {
            var calc = distance($scope.position.lat, $scope.position.lng, station.position.lat, station.position.lng);
            if (calc < dist) {
                dist = calc;
                closestStation = station;
            }
        });
        
        closestStation.dist = dist;
        return closestStation;
    };
})

.controller('MapsCtrl', function($scope, $http, Station, currentPosition) {
    $scope.markers = new Array();

    angular.extend($scope, {
        Center: {
            lat: 48.6930000581379,
            lng: 6.17843627929688,
            zoom: 13
        },
        position: {
            lat: 58.6930000581379,
            lng: 6.17843627929688
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        },
        events: {},
        defaults:{
            //zoomControl : false,
            //keybord : false,
            //dragging : false,
            //doubleClickZoom : false,
            //scrollWheelZoom : false,
            //tap : false,
            //attributionControl : false,
            //zoomAnimation : false,
            //fadeAnimation : false,
            //markerZoomAnimation : false,
            //worldCopyJump : false
        }
    });
})


