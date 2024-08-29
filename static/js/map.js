let map;
let userMarker;
let watchId;

function initMap() {
    console.log('Initializing map...');
    
    // Start with a default location (e.g., Manhattan)
    const defaultLocation = { lat: 40.7831, lng: -73.9712 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultLocation,
    });

        console.log('Map centered on default location');
    }

function startLocationTracking() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            updatePosition,
            handleLocationError,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
        alert('Error: Your browser doesn\'t support geolocation.');
    }
}

function stopLocationTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function updatePosition(position) {
    const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    
    // Center the map on the user's location
    map.setCenter(userLocation);
    
    // Add or update marker for the user's location
    if (userMarker) {
        userMarker.setPosition(userLocation);
    } else {
        userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
            }
        });
    }

    console.log('User location updated');
    
    // Log location data
    logLocation(userLocation, new Date().toISOString());
}

function handleLocationError(error) {
    console.log('Error: ' + error.message);
    alert('Unable to retrieve your location. ' + error.message);
}

function logLocation(location, timestamp) {
    const locationData = {
        latitude: location.lat,
        longitude: location.lng,
        timestamp: timestamp
    };
    
    // Send data to server
    fetch('/log-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
    })
    .then(response => response.json())
    .then(data => console.log('Location logged:', data))
    .catch((error) => console.error('Error logging location:', error));
}

window.onload = function() {
    const mapDiv = document.getElementById('map');
    mapDiv.style.visibility = 'visible';
    mapDiv.style.height = '100%';
    
    const startButton = document.getElementById('startLocationButton');
    const stopButton = document.getElementById('stopLocationButton');
    
    startButton.addEventListener('click', startLocationTracking);
    stopButton.addEventListener('click', stopLocationTracking);
    
    window.dispatchEvent(new Event('resize'));
}
