angular.module('starter.services', [])

.factory('Station', function(){
  var Station = function(data)
  {
    this.number = data.number;
    this.name = data.name;
    this.address = data.address;
    this.position = data.position;
    this.banking = data.banking;
    this.bonus = data.bonus;
    this.status = data.status;
    this.contract_name = data.contract_name;
    this.bike_stands = data.bike_stands;
    this.available_bike_stands = data.available_bike_stands;
    this.available_bikes = data.available_bikes;
    this.last_update = data.last_update;
  };

  return Station;
})

.service('currentPosition', [function() {
  this.position;
}])

