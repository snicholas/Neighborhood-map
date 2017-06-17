var map;
var gm_authDone = true;
var vareseLL={lat: 45.8197693, lng: 8.8256275};
function mapsError(){
  alert('aaa');
}
function gm_authFailure() { 
  console.log("gm_authFailure error");
  gm_authDone = false
};
function initMap() {
  // styles array for icons, color, ecc...
  var styles = [];
  // Create the map centered on Varese, Lombardia, Italy
  if(gm_authDone){
    try{
      map = new google.maps.Map(document.getElementById('map'), {
        center: vareseLL,
        zoom: 15,
        styles: styles,
        mapTypeControl: false
      });
    }catch(e){
      console.log(e);
    }
  }else{
    $('#wrapper').hide();
    $('#nomap').show();
  }
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
function populateInfoWindow(marker, infowindow, locData) {

  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    if(!locData.detailData){
      var dUrl = fsquareDetailVenueUrl.replace('{vid}', locData.id);
      $.ajax({
        url: dUrl,
        success : function(response){
          locData.detailData = {
            contact : response.response.venue.contact ? response.response.venue.contact : " - ",
            rating : response.response.venue.rating ? response.response.venue.rating : " - "
          };
          infowindow.setContent(
            'FourSquare Rating: '+ locData.detailData.rating + "<br>" +
            'FourSquare Contacts (Phone): ' + 
            (locData.detailData.contact.formattedPhone ? locData.detailData.contact.formattedPhone : " - ")
          );
        },
        error : function(err){
          alert(err);
        }
      });
    } else {
      infowindow.setContent(
        'FourSquare Rating: '+ locData.detailData.rating+ "<br>" +
        'FourSquare Contacts (Phone): ' + locData.detailData.contact.formattedPhone
      );

    }
    infowindow.open(map, marker);
    
  }
  // Open the infowindow on the correct marker.
  
}
var fsquareCid="1QYAET3MCLCEK5T12IYFITTGSLVBDSMDYLKUE1AHDVZEOLJR";
var fsquareSec="SB2NOK2U0AHM5FGEIE1ZOR3GD41POHCI3LMFMN2NDE3WMSP4";
var fsquareDetailVenueUrl="https://api.foursquare.com/v2/venues/{vid}/"+
                "?client_id=" + fsquareCid +
                "&client_secret=" + fsquareSec +
                "&v=20170101";
var fsquareUrl = "https://api.foursquare.com/v2/venues/search?ll=" + 
                vareseLL.lat + "," + vareseLL.lng +
                "&query=pizza,caffe&intent=browse&radius=1000"+
                "&client_id=" + fsquareCid +
                "&client_secret=" + fsquareSec +
                "&v=20170101";
var loc = [];
window.onerror = function(msg, url, line){
  console.log(msg);
  $('#wrapper').hide();
  $('#nomap').show();
};
$(document).ready(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
});