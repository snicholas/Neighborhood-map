function Location(locItem){
	this.name = ko.observable(locItem.name);
	this.lat = ko.observable(locItem.lat);
	this.lng = ko.observable(locItem.lng);
}
function LocationViewModel() {
	var self=this;
	self.locations = ko.observableArray([]);
  self.currentFilter = ko.observable();
  self.markers = [];

  self.openInfo = function(loc){
    populateInfoWindow(loc.marker, largeInfowindow);
  }
  self.updateMarkers = function(locs){
    if(map){
      var defaultIcon = makeMarkerIcon('0091ff');
      largeInfowindow = new google.maps.InfoWindow()
      //markers[i].setMap(null);
      if(self.markers.length>0){
        self.markers.forEach(function(marker){
          marker.setMap(null);
        });
      }
      self.markers = [];
      var i = 0;
      locs.forEach(function(loc){
        var position = {lat: loc.lat, lng: loc.lng};
        var title = loc.name;
            // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          icon: defaultIcon,
          id: i
        });
        marker.addListener('click', function() {
              populateInfoWindow(this, largeInfowindow);
            });
        loc.marker=marker;
        self.markers.push(marker);
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(map);
            bounds.extend(self.markers[i].position);
        }

        map.fitBounds(bounds);
        i++;
      });
    }  
  }
  self.filteredLocations = ko.computed(function() {
      var locs=[]
        if(!self.currentFilter()) {
            locs = self.locations(); 
        } else {
            locs = ko.utils.arrayFilter(self.locations(), function(loc) {
              return loc.name.toLowerCase().indexOf(self.currentFilter().toLowerCase())!==-1;
            });
        }
        if(self.markers.length>0){
          self.updateMarkers(locs);
        }
        return locs;
  });
	$.ajax({
    url: fsquareUrl,
    success : function(response){
      var ret=response.response.venues.map(function(v) { 
        return { 
          name : v.name, 
          lat : v.location.lat, 
          lng : v.location.lng
          //, category: v.categories[0] 
        };
      });
      self.locations(ret);

      self.updateMarkers(self.locations());
	  //aggiungere dati a mappa    
    },
    error : function(err){
      alert(err);
    }
  });
}

ko.applyBindings(new LocationViewModel());