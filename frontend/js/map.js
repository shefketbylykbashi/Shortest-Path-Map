var map;
var state = 'Node';
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
  
  function addEdge(){
    for (let marker of markers ) {
        google.maps.event.addListener(marker,'click', function(event) {
            edge.push( { idx: 0 + marker.label - 1, latLng: marker.position })
            if (edge.length == 1) {
                //edge[0].idx
            } else if (edge.length == 2) {
                let path = [edge[0].latLng ,edge[1].latLng];
                drawLine(path,map,'#FF0000');
                
                // Calculate the distance between the two markers using the Euclidean distance formula
				const p1 = edge[0].latLng;
                const p2 = edge[1].latLng;
                const distance = 111 * Math.sqrt(
                    Math.pow((p2.lat() - p1.lat()), 2) +
                    Math.pow((p2.lng() - p1.lng()), 2)
                );
                
                // Add the edge to the edge list with the calculated distance
                edgeList.push({a:edge[0].idx , b:edge[1].idx});
                
				// const middleLatLng = new google.maps.LatLng((p1.lat() + p2.lat()) / 2, (p1.lng() + p2.lng()) / 2);
                // const marker = new google.maps.Marker({
                //     position: middleLatLng,
                //     map: map,
					
                //     label: distance.toFixed(2),
                // });
				const middleLatLng = new google.maps.LatLng((p1.lat() + p2.lat()) / 2, (p1.lng() + p2.lng()) / 2);
                const infoWindow = new google.maps.InfoWindow({
                    content: `Edge distance: ${distance.toFixed(2)} km`,
                    position: middleLatLng,
                });
                infoWindow.open(map);

                // Display the distance in the console
                //console.log(`Edge distance: ${distance} km`);
                
                edge = []
            }
        })
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
		}	else if (state == 'Edge') {
			for (let marker of markers) {
				google.maps.event.clearListeners(marker, 'click')
			}
			$('#cardTitle').html('Define your starting and end node')
			$('#stateButton').val('Next: Calculate Route')
			for (let marker of markers) {
				google.maps.event.addListener(marker, 'click', (event) => {
					//Change the marker icon
					stfin.push(0 + marker.label - 1)
					var icon = { 	scaledSize: new google.maps.Size(40,40) }
					if (stfin.length == 1) {
						$('#cardContent').html('Start Node: ' + (stfin[0] + 1))
					} else if (stfin.length == 2) {
						$('#cardContent').html('Start Node: ' + (stfin[0] + 1) + ' <br/> ' + 'Finish Node: ' + (stfin[1] + 1))
					}
				})
			}
			state = 'Calculate'
			}
			else if (state == 'Calculate') {
				var algorithmSelect = document.getElementById("algorithm");
				var selectedAlgorithm = algorithmSelect.value;
				console.log(selectedAlgorithm);
				if (selectedAlgorithm == 'astar'){
				$.post({
					type: 'POST',
					url : 'http://localhost:5000/a-star',
					data: {
						node  : JSON.stringify(nodes),
						edge  : JSON.stringify(edgeList),
						start : stfin[0],
						end   : stfin[1]
					},
					success: (data) => {
						var route = ''
						var shortestPath = []
						console.log(data.distance)
						for(var i = 0; i < data.route.length; i++) {
							route += (data.route[i] + 1)
							if(i != (data.route.length-1)) {
								route += ' - '  
							}
							if(i == (data.route.length-1)) {
								route += '<br> Distance: ' + data.distance
							}
							for(let marker of markers) {
								if(data.route[i] == (marker.label-1)) {
									shortestPath.push(marker.position)
								}
							}
						}
						$('#cardContent').html(route)
						drawLine(shortestPath,map,'#0000FF')
					}				
				})
				$('#cardTitle').html('Shortest Path')}
				else if (selectedAlgorithm == 'dijkstra'){
					$.post({
						type: 'POST',
						url : 'http://localhost:5000/dijkstra',
						data: {
							node  : JSON.stringify(nodes),
							edge  : JSON.stringify(edgeList),
							start : stfin[0],
							end   : stfin[1]
						},
						success: (data) => {
							var route = ''
							var shortestPath = []
							console.log(data.distance)
							for(var i = 0; i < data.route.length; i++) {
								route += (data.route[i] + 1)
								if(i != (data.route.length-1)) {
									route += ' - '  
								}
								if(i == (data.route.length-1)) {
									route += '<br> Distance: ' + data.distance
								}
								for(let marker of markers) {
									if(data.route[i] == (marker.label-1)) {
										shortestPath.push(marker.position)
									}
								}
							}
							$('#cardContent').html(route)
							drawLine(shortestPath,map,'#0000FF')
						}
					})
					$('#cardTitle').html('Shortest Path')
				}
  	        }
       }