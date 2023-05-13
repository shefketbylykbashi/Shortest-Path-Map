var nodes = [];
var edge = [];
var edgeList = [];
var stfin = [];
var labelIndex = 1;
var markers = [];



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