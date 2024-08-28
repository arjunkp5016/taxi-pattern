// static/js/map.js

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

    console.log('Map initialized');
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center the map on the user's location
                map.setCenter(userLocation);
                map.setZoom(15);  // Zoom in closer
                
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

                console.log('User location set');
            },
            (error) => {
                console.log('Error: ' + error.message);
                alert('Unable to retrieve your location. ' + error.message);
            }
        );
    } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
        alert('Error: Your browser doesn\'t support geolocation.');
    }
}

// Initialize the map and add event listeners when the window loads
window.onload = function() {
    const mapDiv = document.getElementById('map');
    mapDiv.style.visibility = 'visible';
    mapDiv.style.height = '100%';
    
    // Add click event listener to the location button
    document.getElementById('locationButton').addEventListener('click', getUserLocation);
    
    // Force a resize event to ensure the map fills the container
    window.dispatchEvent(new Event('resize'));
}