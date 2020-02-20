// Global Variables

URLS = {
    "loadMap": 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    "charges": '/public/charges.json',
    "reverseGeocoding" : "https://eu1.locationiq.com/v1/reverse.php?key=",
    "searchGeocoding" : "https://eu1.locationiq.com/v1/search.php?key="
};

/* Default Lyon position */
lat = 45.75;
lng = 4.85;

/* List of lat/lng of the current trip selected by the user */
TRIP = {
    departure : {
        "lat": null,
        "lng": null
    },
    destination: {
        "lat": null,
        "lng": null
    }
};

// the input of the selected locate me
activeLocateMeInput = null;
//its id
activeLocateMeInputID = null;
//the current step
activeLocateMeStep = null;

