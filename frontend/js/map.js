var map;
var state = 'Node';
function addNode()
var nodes = [];
var edge = [];
var edgeList = [];
var stfin = [];
var labelIndex = 1;
var markers = [];

function initMap() {
	var Prishtina ={lat: 42.667542, lng: 21.166191} 
	
	var noPoi = [
		{
			featureType: 'poi',
			stylers: [ { visibility: 'off' } ]   
		}
	]
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: Prishtina,
		fullscreenControl: false
	})
	map.setOptions({ styles: noPoi })

	var input = document.getElementById('pac-input')
	var searchBox = new google.maps.places.SearchBox(input)
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)


	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds())
	})

	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces()
		var bounds = new google.maps.LatLngBounds()
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log('Returned place contains no geometry')
				return
			}
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport)
			} else {
				bounds.extend(place.geometry.location)
			}
		})
		map.fitBounds(bounds);
		var listener = google.maps.event.addListener(map, 'idle', function() { 
			if (map.getZoom() < 16) map.setZoom(16)
			google.maps.event.removeListener(listener)
		})
	})

	google.maps.event.addListener(map, 'click', function(event) {
		var myLatLng = event.latLng
		var lat = myLatLng.lat()
		var lng = myLatLng.lng()
		if (state == 'Node') {
			addNode(event.latLng, map)
			nodes.push({ lat: lat, lng: lng })
		}
	})

}


// Adds a marker to the map.
function addNode(location, map) {
	// Add the marker at the clicked location, and add the next-available label
	// from the array of alphabetical characters.
	var marker = new google.maps.Marker({
	  position: location,
	  label: "" + labelIndex++,
	  map: map,
	});
	google.maps.event.addListener(marker, "click", (event) => {
	  let i = 0;
	  while (i < markers.length && markers[i].position !== event.latLng) {
		i++;
	  }
	  if (markers[i].position === event.latLng) {
		markers[i].setMap(null);
		markers.splice(i, 1);
		i--;
		labelIndex--;
		console.log(markers);
		for (var j = 0; j < markers.length; j++) {
		  markers[j].setLabel("" + (j + 1));
		}
	  }
	});
	markers.push(marker);
	if (markers.length >= 2) {
	  $("#stateButton").show();
	}
	if (markers.length >= 1) {
	  $("#deleteButton").show();
	}
  }
  
  function drawLine(location, map, color) {
	new google.maps.Polyline({
	  map: map,
	  path: location,
	  geodesic: true,
	  strokeColor: color,
	  strokeOpacity: 0.5,
	  strokeWeight: 4,
	});
  }
  
  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
	}
  }
  
  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
	setMapOnAll(null);
  }
  
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
	clearMarkers();
	markers = [];
	labelIndex = 1;
  }
  
  function addEdge() {
	for (let marker of markers) {
	  google.maps.event.addListener(marker, "click", function (event) {
		edge.push({ idx: 0 + marker.label - 1, latLng: marker.position });
		if (edge.length == 1) {
		  //edge[0].idx
		} else if (edge.length == 2) {
		  let path = [edge[0].latLng, edge[1].latLng];
		  drawLine(path, map, "#FF0000");
		  edgeList.push({ a: edge[0].idx, b: edge[1].idx });
		  edge = [];
		}
	  });
	}
  }

  function nextState() {
	if(state == 'Node') {
		$('#deleteButton').remove()
		state = 'Edge';
		$('#stateButton').val('Next: Define Start and End')
		$('#cardContent').html('Click on 2 nodes to define the edge between those nodes of the graph')
		$('#cardTitle').html('Add Edge')
		google.maps.event.clearListeners(map, 'click')
		for (let marker of markers) {
			google.maps.event.clearListeners(marker, 'click')
		}
		addEdge()
	}
}
