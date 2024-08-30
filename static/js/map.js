
// As of February 21st, 2024, google.maps.Marker is deprecated. 
// Please use google.maps.marker.AdvancedMarkerElement instead. 
// At this time, google.maps.Marker is not scheduled to be discontinued, 
// but google.maps.marker.AdvancedMarkerElement is recommended over google.maps.Marker. 
// While google.maps.Marker will continue to receive bug fixes for any major regressions, 
// existing bugs in google.maps.Marker will not be addressed. 
// At least 12 months notice will be given before support is discontinued. 
// Please see https://developers.google.com/maps/deprecations for additional details and https://developers.google.com/maps/documentation/javascript/advanced-markers/migration for the migration guide.
let map;
let userMarker;
let watchId;
let currentHeading = 0;

function initMap() {
    console.log('Initializing map...');
    
    // Start with a default location (e.g., Manhattan)
    const defaultLocation = { lat: 40.7831, lng: -73.9712 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
        heading: currentHeading, // Set initial heading
    });

    //Handle orientation changes
    window.addEventListener('deviceorientation', (event) => {
        const alpha = event.alpha; // The rotation aroung the z-axis (in-degrees)
        updateMapHeading(alpha)
    })

        console.log('Map centered on default location');
    }

function updateMapHeading(heading) {
    currentHeading = heading;
    map.setHeading(heading); // Update the map heading to rotate based on device orientation
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
    map.setZoom(17)

    // Add or update marker for the user's location
    if (userMarker) {
        userMarker.setPosition(userLocation);
    } else {
        userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
                url: 'static/favicon.ico',
                scaledSize: new google.maps.Size(32, 32), //Set the size of the icon
                origin: new google.maps.Point(0, 0), //origin point of the image (top-left corner)
                anchor: new google.maps.Point(16, 16) //Anchor point of the image (where the point is considered)
            }
            // icon: {
            //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            //     scale: 10,
            //     fillColor: "#FFFF00", //yellow fill
            //     fillOpacity: 1,
            //     strokeWeight: 2,
            //     strokeColor: "#000000", //black border
            //     rotation: 0 //update this with the actual header
            // }
        });
    }

    //update arrow rotation if heading is available 
    if (position.coords.heading != null) {
        const icon = userMarker.getIcon();
        icon.rotation = position.coords.heading;
        userMarker.setIcon(icon);
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
        timestamp: timestamp,
        // heading: position.coords.heading
    };
    
    console.log(locationData)

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
    const pickup = document.getElementById('logLocation')
    
    startButton.addEventListener('click', startLocationTracking);
    stopButton.addEventListener('click', stopLocationTracking);
    pickup.addEventListener('click', logLocation);
    
    window.dispatchEvent(new Event('resize'));
}
