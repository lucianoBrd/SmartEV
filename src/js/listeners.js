initializeListeners = function (map) {
    map.on('click', function (event) {
        reverseGeocoding(event.latlng['lat'], event.latlng['lng']);
    });

    $('#location-marker').on('click', function (event) {
        /* Change the map center to the location */
        map.flyTo([lat, lng], 11);
    });

    $(document).on('reverse-geocoding-done', function (e, data) {
        if (activeLocateMeInput !== null) {
            //set the value of reverse geocoding in the input
            activeLocateMeInput.value = data.display_name;

            //load lat and lng in the corresponding variable
            $(document).trigger('load-' + activeLocateMeStep, data);

            //display the popover
            $(document).trigger('display-popover', data.display_name);

            addMarker(map, data);
console.log(userMarkers);
            resetLocateMe();
        }
    });

    $(document).on('display-popover', function (e, data) {
        //set the popover content
        $(activeLocateMeInput).data('content', data);
    });

    $(document).on('load-departure', function (e, data) {
        //set the departure coordinates
        TRIP.departure['lat'] = data['lat'];
        TRIP.departure['lng'] = data['lon'];
    });

    $(document).on('load-destination', function (e, data) {
        //set the destination coords
        TRIP.destination['lat'] = data['lat'];
        TRIP.destination['lng'] = data['lon'];
    });

    $("#search-trip").on('click', function () {
        var error = false;
        //check if the input fields are setted
        $.each(TRIP, function (key, item) {
            if (item['lat'] == null || item['lng'] == null) {
                error = true;
            }
        });

        if (!error) {
            //if there is no mistake, calculate the trip
            $(document).trigger('calculate-trip');
        }
    });

    $(document).on('calculate-trip', function () {
        //leaflet calculation
        L.Routing.control({
              waypoints: [
                  L.latLng(TRIP.departure['lat'], TRIP.departure['lng']),
                  L.latLng(TRIP.destination['lat'], TRIP.destination['lng'])
              ],
              router: L.Routing.mapbox(token),
              position: 'topleft'
          })
          .on('routeselected', function(e) {
            displayRoadSheet(e.route)
        }).addTo(map);
         removeUserMarkers(map);
    });
};
