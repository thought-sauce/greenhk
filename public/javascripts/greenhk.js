// init
var centreLatitude = 22.362;
var centreLongitude = 114.1;
var centreLatLong = new google.maps.LatLng(centreLatitude, centreLongitude);
var initZoomIndex = 11;

var gMarkersHash = new Array();
var map;
var markers = {
  'recycleBins':  recycleBins,
  'districts':    districts,
  'subdistricts': subdistricts
}

var infoWindow = new google.maps.InfoWindow({
	size: new google.maps.Size(250,80) 
});

var currentFocus;

function handleResize() {
	var height = window.innerHeight - 75;
	
	$('#map').height(height + 'px');
	$('#sidebar').height(height + 'px');
}

function drawMapAndMarkers() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: centreLatLong,
		zoom:   initZoomIndex,
		minZoom: 11,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
    var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(22.170731493009676, 113.75255737304688),
                                 new google.maps.LatLng(22.553006189993233, 114.44744262695313));
	map.fitBounds(bounds);

	google.maps.event.addListener(map, 'click', function() {
		infoWindow.close();
	});
	var gMarkers = new Array();
	for (var index in markers.recycleBins) {
		marker = markers.recycleBins[index];
		gMarker = addMarkerToMap(map, marker);
		gMarkersHash[marker.id] = gMarker;
		gMarkers[index] = gMarker;
	}
	mgr = new MarkerManager(map, {trackMarkers: true, maxZoom: 20});

	google.maps.event.addListener(mgr, 'loaded', function() {
		// mgr.addMarkers(markers.districts, 11);
		// mgr.addMarkers(markers.subdistricts, 12, 13);
		mgr.addMarkers(gMarkers, 14, 20);
		mgr.refresh();
	});
}

function addMarkerToMap(map, marker) {
	var gMarker = new google.maps.Marker({
		title:  marker.add + " --- " + marker.add_eng,
		position: new google.maps.LatLng(marker.long, marker.lat),
		icon: "/images/recycle.png"
	});

	google.maps.event.addListener(gMarker, 'click', function() {
		showInfoWindow(gMarker);
	});
	return gMarker;
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
	$('sidebar-item-' + id).addClass("current");

    var marker = gMarkersHash[id];
    var latValue = marker.position.wa;
    var longValue = marker.position.ya;
	var bounds = new google.maps.LatLngBounds(
	                   new google.maps.LatLng(latValue - 0.0005, longValue - 0.0005),
	                   new google.maps.LatLng(latValue + 0.0005, longValue + 0.0005)
	             );
	map.fitBounds(bounds);
	
	showInfoWindow(marker);

	currentFocus=id;
}

function showInfoWindow(gMarker) {
	var contentString = gMarker.getTitle().split(" --- ");
	infoWindow.setContent("<p>" + contentString[0] + "</p><p>" + contentString[1] + "</p>");
	infoWindow.open(map, gMarker);
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

    $(window).bind("resize", handleResize);
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

// TODO detect user current location