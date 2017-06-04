$(function() {
	// generate unique user id
	var userId = 12345;// Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');
	var map;

	var info = $('#infobox');
	var doc = $(document);

	// custom marker's icon styles
	var tinyIcon = L.Icon.extend({
		options: {
			shadowUrl: '../assets/marker-shadow.png',
			iconSize: [25, 39],
			iconAnchor:   [12, 36],
			shadowSize: [41, 41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});
	var redIcon = new tinyIcon({ iconUrl: '../assets/marker-red.png' });
	var yellowIcon = new tinyIcon({ iconUrl: '../assets/marker-yellow.png' });

	var sentData = {};

	var connects = {};
	var markers = {};
	var active = false;

	socket.on('load:coords', function(data) {
		if (!(data.id in connects)) {
			
			setMarker(data);
			//alert(data.toSource());
			console.log(data);
		}
		else
		{
			delete connects[data.id];
                        map.removeLayer(markers[data.id]);
			setMarker(data);
		}

		console.log('O:'+connects.toSource());
		connects[data.id] = data;
		connects[data.id].updated = $.now();
		console.log('N:'+connects.toSource());
	});

	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}

	//showMap(0,0,0);
	function showMap(lat, lng, acr) {
		// mark user's position
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		// uncomment for static debug
		// userMarker = L.marker([51.45, 30.050], { icon: redIcon });

		// load leaflet map
		map = L.map('map');
		L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={accessToken}', { attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', maxZoom: 18, id: 'minfon', accessToken: 'pk.eyJ1IjoibWluZm9uIiwiYSI6ImNpenRvbDdjZjAxYm0zM29ndnptc2c4MnUifQ.s4l1iMag-nFNkMjSQHEMRA'}).addTo(map);

		// set map bounds
		map.fitWorld();

map.setView([lat, lng],15);

		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there.! Your ID is ' + userId + '</p>').openPopup();

		var emit = $.now();
		// send coords on when user is active
		doc.on('mousemove', function() {
			active = true;

			sentData = {
				id: userId,
				active: active,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				},{lat: 1,
                                        lng: 1,
                                        acr: acr
},{lat: -30,
                                        lng: -30,
                                        acr: acr
}]
			};

			if ($.now() - emit > 30) {
				//socket.emit('send:coords', sentData);
				emit = $.now();


			}
		});
	}

	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;
		showMap(lat,lng,acr);
	}

	doc.bind('mouseup mouseleave', function() {
		active = false;
	});

	// showing markers for connections
	function setMarker(data) {
		for (var i = 0; i < data.coords.length; i++) {
			map.panTo([data.coords[i].lat, data.coords[i].lng]);
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>One more external user is here!</p>');
			markers[data.id] = marker;
		}
	}

	// handle geolocation api errors
	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		//showError('Error:' + errors[error.code]);
		var lat = 0;
		var lng = 0;
		var acr = 0;
		showMap(lat,lng,acr);
	}

	function showError(msg) {
		info.addClass('error').text(msg);

		doc.click(function() {
			info.removeClass('error');
		});
	}

	// delete inactive users every 15 sec
	setInterval(function() {
		for (var ident in connects){
			if ($.now() - connects[ident].updated > 15000) {
				delete connects[ident];
				map.removeLayer(markers[ident]);
			}
		}
	}, 15000);
});

