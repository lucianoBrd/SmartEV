initializeListeners = function (map) {
    map.on('click', function (event) {
        reverseGeocoding($, event.latlng['lat'], event.latlng['lng']);
    });

    $(document).on('reverse-geocoding-done', function (e, data) {
        if (activeLocateMeInput !== null) {
            activeLocateMeInput.value = data.display_name;
            $(document).trigger('load-' + activeLocateMeStep, data);
            $(document).trigger('display-popover', data.display_name);
        }
    });

    $(document).on('display-popover', function (e, data) {
        $(activeLocateMeInput).data('content', data);
    });

    $(document).on('load-departure', function (e, data) {
        TRIP.departure['lat'] = data['lat'];
        TRIP.departure['lng'] = data['lon'];
    });

    $(document).on('load-destination', function (e, data) {
        TRIP.destination['lat'] = data['lat'];
        TRIP.destination['lng'] = data['lon'];
    });

    $("#search-trip").on('click', function () {
        var error = false;
        $.each(TRIP, function (key, item) {
            if (item['lat'] == null || item['lng'] == null) {
                console.log("IKBOUL");
                error = true;
            }
        });

        if (!error) {
            $(document).trigger('calculate-trip');
        }
    });

    $(document).on('calculate-trip', function () {
        console.log(L);
        L.Routing.control({
                              waypoints: [
                                  L.latLng(TRIP.departure['lat'], TRIP.departure['lng']),
                                  L.latLng(TRIP.destination['lat'], TRIP.destination['lng'])
                              ]
                          }).addTo(map);
    });
};
