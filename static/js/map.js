let map;
let userMarker;

function initMap() {
    console.log('Initializing map...');
    
    // Start with a default location (e.g., Manhattan)
    const defaultLocation = { lat: 40.7831, lng: -73.9712 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
    });

    // Request user location permission
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center the map on the user's location
                map.setCenter(userLocation);
                
                // Add a marker for the user's location
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

                console.log('User location set');
            },
            (error) => {
                console.error('Error occurred while retrieving location:', error.message);
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Permission to access location was denied. Default location will be used.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    alert('Location information is unavailable.');
                } else if (error.code === error.TIMEOUT) {
                    alert('The request to get user location timed out.');
                } else {
                    alert('An unknown error occurred.');
                }
                // Keep the default location if geolocation fails
                new google.maps.Marker({
                    position: defaultLocation,
                    map: map,
                    title: "Manhattan",
                });
                
            }
        );
    } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
        alert('Geolocation is not supported by your browser. Default location will be used.');
    }

    new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Manhattan",
    });

    console.log('Map initialized');
}

// Ensure the map container is visible before initializing
window.onload = function() {
    const mapDiv = document.getElementById('map');
    mapDiv.style.visibility = 'visible';
    mapDiv.style.height = '100%';
    // Force a resize event to ensure the map fills the container
    window.dispatchEvent(new Event('resize'));
}
