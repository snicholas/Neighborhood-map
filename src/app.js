function Location(locItem){
  this.name = locItem.name;
  this.lat = locItem.lat;
  this.lng = locItem.lng;
  this.id =  locItem.id;
  this.detailData = null;
}
function toggleMarkerBounce(marker){
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  }
  marker.setAnimation(google.maps.Animation.BOUNCE);
  window.setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}
function LocationViewModel() {
  var self=this;
  self.locations = ko.observableArray([]);
  self.currentFilter = ko.observable('');
  self.markers = [];

  self.openInfo = function(loc){
    populateInfoWindow(loc.marker, largeInfowindow, loc);
    toggleMarkerBounce(loc.marker);
  };
  self.updateMarkers = function(locs){
    if(map){
      var defaultIcon = makeMarkerIcon('0091ff');
      largeInfowindow = new google.maps.InfoWindow();
      if(self.markers.length>0){
        self.markers.forEach(function(marker){
          var locMarker = $.grep(locs, function(l){ return l.id == marker.id; });
          if(locMarker && locMarker.length > 0){
            marker.setVisible(true);
          } else {
            marker.setVisible(false);
          }
          
        });
      } else {
        self.markers = [];
        var i = 0;
        var bounds = new google.maps.LatLngBounds();
        locs.forEach(function(loc){
          var position = {lat: loc.lat, lng: loc.lng};
          var title = loc.name;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: loc.id
          });
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow, loc);
            toggleMarkerBounce(this);
          });
          loc.marker=marker;
          self.markers.push(marker);
          
          // Extend the boundaries of the map for each marker and display the marker
          for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(map);
            bounds.extend(self.markers[i].position);
          }
          map.fitBounds(bounds);
          i++;
        });
        google.maps.event.addDomListener(window, 'resize', function() {
          map.fitBounds(bounds);
        });
      }
    }
  };
  self.filteredLocations = ko.computed(function() {
    var locs=[];
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
          lng : v.location.lng,
          id: v.id
        };
      });
      self.locations(ret);
      self.updateMarkers(self.locations());
    // aggiungere dati a mappa    
    },
    error : function(err){
      console.log(err);
    }
  });
}

ko.applyBindings(new LocationViewModel());
