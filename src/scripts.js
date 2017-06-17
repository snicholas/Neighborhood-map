var map;
var vareseLL={lat: 45.8197693, lng: 8.8256275};
function initMap() {
  //styles array for icons, color, ecc...
  var styles = [];
  // Create the map centered on Varese, Lombardia, Italy

  map = new google.maps.Map(document.getElementById('map'), {
    center: vareseLL,
    zoom: 15,
    styles: styles,
    mapTypeControl: false
  });
}
function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
var largeInfowindow;
function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }
var fsquareCid="1QYAET3MCLCEK5T12IYFITTGSLVBDSMDYLKUE1AHDVZEOLJR";
var fsquareSec="SB2NOK2U0AHM5FGEIE1ZOR3GD41POHCI3LMFMN2NDE3WMSP4";
var fsquareUrl = "https://api.foursquare.com/v2/venues/search?ll=" + 
                vareseLL.lat + "," + vareseLL.lng +
                "&query=pizza,caffe&intent=browse&radius=1000"+
                "&client_id=" + fsquareCid +
                "&client_secret=" + fsquareSec +
                "&v=20170101";
var loc = [];
$(document).ready(function() {
  $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});