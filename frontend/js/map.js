var map
var state = 'Node'

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


function addNode()