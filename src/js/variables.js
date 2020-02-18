// Global Variables

URLS = {
    "loadMap": 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    "charges": '/public/charges.json',
    "reverseGeocoding" : "https://eu1.locationiq.com/v1/reverse.php?key="
};

/* Default Lyon position */
lat = 45.75;
lng = 4.85;

activeLocateMeInput = null;
