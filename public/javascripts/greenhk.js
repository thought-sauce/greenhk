// init
var centreLatitude = 22.362;
var centreLongitude = 114.1;
var centreLatLong = new google.maps.LatLng(centreLatitude, centreLongitude);
var initZoomIndex = 11;

var markers = {
  'recycleBins':  recycleBins,
  'districts':    districts,
  'subdistricts': subdistricts
}

// var markers = {
//   'recycleBins':  <%= recycle_bins %>,
//   'districts':    <%= districts %>,
//   'subdistricts': <%= subdistricts %>
// }

var currentFocus;
var markerHash = {};

function handleResize() {
	var height = self.innerHeight - 30;
	
	$('map').height(height + 'px');
	$('sidebar').height(height + 'px');
}

function drawMapAndMarkers() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: centreLatLong,
    zoom:   initZoomIndex,
    minZoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var gMarkers = Array();
  for (var index in markers.recycleBins) {
	marker = markers.recycleBins[index];
	gMarkers[index] = new google.maps.Marker({
		title: marker.add + " - " + marker.add_eng,
	    position: new google.maps.LatLng(marker.long, marker.lat),
	    icon: "/images/recycle.png"
	  });
	markerHash[marker.id] = {marker: gMarkers[index], visible:true};
  }
  mgr = new MarkerManager(map, {trackMarkers: true, maxZoom: 20});

  google.maps.event.addListener(mgr, 'loaded', function() {
     // mgr.addMarkers(markers.districts, 11);
     // mgr.addMarkers(markers.subdistricts, 12, 13);
    mgr.addMarkers(gMarkers, 14, 20);
    mgr.refresh();
  });
}

function drawSideBar() {
  var menu = "";

  $.each(districts, function(i, district){
	menu += "<ul class=\"districts\">";
	menu += "  <li id=\"sidebar-item-" + district.id + " class=\"district-item\">" + district.name + " " + district.name_eng;
	
	menu += drawSubdistrictSideBar(district);
	
	menu += "  </li>";
	menu += "</ul>";
  });

  var $sidebar = $('#sidebar');
  $sidebar.html(menu);
}

function drawSubdistrictSideBar(district) {
  var menu ="";

  menu += "<ul id=\"sidebar-list\" class=\"subdistricts\">";

  $.each(subdistricts, function(i, subdistrict){
	if (subdistrict.districtid == district.id) {
      menu += "<li id=\"sidebar-item-" + subdistrict.id + "\" class=\"subdistrict-item collapse\">";
      menu += "<a onclick=\"toggleExpand('sidebar-item-" + subdistrict.id + "'); return false;\" href=\"#\">" + subdistrict.name + " " + subdistrict.name_eng +"</a>";
      menu += drawRecycleBinSideBar(subdistrict);
      menu += "</li>";
    }
  });

  menu += "</ul>";

  return menu;	
}

function drawRecycleBinSideBar(subdistrict) {
  var menu = "";

  menu += "<ul id=\"sidebar-list\" class=\"recycle_bins\">";

  $.each(recycleBins, function(i, recycleBin){
	if (recycleBin.subdistrictid == subdistrict.id) {
      menu += "<li id=\"sidebar-item-" + recycleBin.id + "\" class=\"recycle-bin-item\">";
      menu += "<a onclick=\"focusPoint('" + recycleBin.id + "'); return false;\" href=\"#\">" + recycleBin.add + " " + recycleBin.add_eng +"</a>";
      menu += "</li>";
     }
  });

  menu += "</ul>";
  return menu;
}

// mobile size
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = $('$map')

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.width = '100%';
    mapdiv.height = '100%';
  }
}

function focusPoint(id) {
  if (currentFocus) {
    $('#sidebar-item-' + currentFocus).removeClass("current");
  }
  $('sidebar-item-'+id).addClass("current");

  console.log("focus");	
  // markerHash[id].marker.openInfoWindowHtml(markerHash[id].marker.description);

  currentFocus=id;
}

function toggleExpand(element_id) {	
	var element = $("#"+ element_id);
		
	if (element.hasClass('collapse')) {
	  element.removeClass('collapse');
	  element.addClass('expand');
	} else if (element.hasClass('expand')) {
	  element.removeClass('expand');
	  element.addClass('collapse');	
	}
}

function initialize() {
  drawSideBar();

  handleResize();

  drawMapAndMarkers();
}

// datatable for listing
$(document).ready(function(){
  $('.crud-list').dataTable({
    "sPaginationType": "full_numbers",
     "iDisplayLength": 50
  });

  initialize();
});

// detect user current location

// Note that using Google Gears requires loading the Javascript
// at http://code.google.com/apis/gears/gears_init.js

// var initialLocation;
// var siberia = new google.maps.LatLng(60, 105);
// var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
// var browserSupportFlag =  new Boolean();
// 
// function initialize() {
//   var myOptions = {
//     zoom: 6,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//   
//   // Try W3C Geolocation (Preferred)
//   if(navigator.geolocation) {
//     browserSupportFlag = true;
//     navigator.geolocation.getCurrentPosition(function(position) {
//       initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//       map.setCenter(initialLocation);
//     }, function() {
//       handleNoGeolocation(browserSupportFlag);
//     });
//   // Try Google Gears Geolocation
//   } else if (google.gears) {
//     browserSupportFlag = true;
//     var geo = google.gears.factory.create('beta.geolocation');
//     geo.getCurrentPosition(function(position) {
//       initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
//       map.setCenter(initialLocation);
//     }, function() {
//       handleNoGeoLocation(browserSupportFlag);
//     });
//   // Browser doesn't support Geolocation
//   } else {
//     browserSupportFlag = false;
//     handleNoGeolocation(browserSupportFlag);
//   }
//   
//   function handleNoGeolocation(errorFlag) {
//     if (errorFlag == true) {
//       alert("Geolocation service failed.");
//       initialLocation = newyork;
//     } else {
//       alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
//       initialLocation = siberia;
//     }
//     map.setCenter(initialLocation);
//   }
// }
