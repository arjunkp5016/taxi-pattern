let map;
let userMarker;

function initMap() {
    console.log('Initializing map...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 15,
                    center: userLocation,
                });
                
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
                        strokeColor: "#e8a509",
                    }
                });

                console.log('Map centered on user location');
            },
            (error) => {
                console.log('Error retrieving user location: ' + error.message);
                
                // Fallback to a default location (e.g., New York City)
                const defaultLocation = { lat: 40.7831, lng: -73.9712 };
                
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: defaultLocation,
                });

                console.log('Map centered on default location');
            }
        );
    } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
        alert('Error: Your browser doesn\'t support geolocation.');

        // Fallback to a default location (e.g., New York City)
        const defaultLocation = { lat: 40.7831, lng: -73.9712 };

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: defaultLocation,
        });

        console.log('Map centered on default location');
    }
}

// function initMap() {
//     console.log('Initializing map...');
//     
//     const defaultLocation = { lat: 40.7831, lng: -73.9712 };
//     
//     map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 12,
//         center: defaultLocation,
//     });
//
//     console.log('Map initialized');
// }

function getUserLocation() {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy:true,
            timeout: 5000,
            maximumAge:0
        };
        navigator.geolocation.watchPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                map.setCenter(userLocation);
                map.setZoom(15);
                
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
                            strokeColor: "#e8a509",
                        }
                    });
                }

                console.log('User location set');
                
                // Capture and send location data
                const timestamp = new Date().toISOString();
                const locationData = {
                    latitude: userLocation.lat,
                    longitude: userLocation.lng,
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

window.onload = function() {
    const mapDiv = document.getElementById('map');
    mapDiv.style.visibility = 'visible';
    mapDiv.style.height = '100%';
    
    document.getElementById('locationButton').addEventListener('click', getUserLocation);
    
    initMap()

    window.dispatchEvent(new Event('resize'));
}
