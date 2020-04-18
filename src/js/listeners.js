initializeListeners = function (map) {
    map.on('click', function (event) {
        if (activeLocateMeInput !== null && !activeTrip) {
            reverseGeocoding(event.latlng['lat'], event.latlng['lng']);
        }
    });

    $('#location-marker').on('click', function (event) {
        /* Change the map center to the location */
        map.flyTo([lat, lng], 11);
    });

    $(document).on('reverse-geocoding-done', function (e, data) {
        if (activeLocateMeInput !== null && !activeTrip) {
            //set the value of reverse geocoding in the input
            activeLocateMeInput.value = data.display_name;

            //load lat and lng in the corresponding variable
            $(document).trigger('load-' + activeLocateMeStep, data);

            //display the popover
            $(document).trigger('display-popover', data.display_name);

            addMarker(map, data);

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

        /* Check model */
        var error = findModel();

        /* Remove error text */
        showError(false);

        //check if the input fields are setted
        $.each(TRIP, function (key, item) {
            if (item['lat'] == null || item['lng'] == null) {
                error = true;
            }
        });

        if (!error) {
            if (!activeTrip) {
                /* if there is no mistake, calculate the trip */
                $(document).trigger('calculate-trip');

                /* Initialize trip */
                statusForm(true);
            } else {
                /* Reset Trip */
                statusForm(false);
            }
        }
    });

    $(document).on('calculate-trip', function () {
        $(document).trigger('start-loader');
        //leaflet calculation
        routing = L.Routing.control({
            waypoints: [
                L.Routing.waypoint(
                    L.latLng(TRIP.departure['lat'], TRIP.departure['lng']),
                    "<h3>Départ</h3>"
                ),
                L.Routing.waypoint(
                    L.latLng(TRIP.destination['lat'], TRIP.destination['lng']),
                    "<h3>Arrivée</h3>"
                )
            ],
            createMarker: function (i, wp, nWps) {
                return L.marker(wp.latLng)
                    .bindPopup(wp.name);
            },
            lineOptions: {
                addWaypoints: false,
                draggableWaypoints: false
            },
            router: L.Routing.mapbox(token, { language: 'fr' }),
            autoRoute: false
        });
        routing.on('routeselected', function (e) {
            displayRoadSheet(e.route)
        }).addTo(map);

        routing._container.style.display = "None";

        /* Remove old markers */
        removeUserMarkers(map);

        routing.on('routesfound', function (e) {

            var routes = e.routes;

            var steps = calculateChargeStep(routes[0].instructions, routes[0].coordinates, routes[0].summary.totalDistance);

            if(steps) {
                /* Compute time to charge the char and
                 add step to the routing for each steps */
                var waypointLength = this.getWaypoints().length;

                //create markers and return time to add
                var time = createTripStepMarkers(steps, waypointLength, this);

                /* Add to trip time */
                tripTime += time;

                /* Convert time */
                var totalTime = formatTime(tripTime);

                /* Update trip time in the page  */
                var tt = $('#trip-time');
                if (tt) {
                    $(tt).text(totalTime);
                }

            }
        });

        routing.route();
        routing._container.style.display = "None";
    });

    $(document).on('start-loader', function () {
        $(".wrapper").addClass('back-opacity');
        $('#loader').removeClass('d-none');
        $('#loader').addClass('d-block');
    });

    $(document).on('finish-loader', function () {
        if(failedCompute) {
            /* Error case */
            setTimeout(function() {
                /* Display error text */
                showError(true);

                /* Reset Trip */
                statusForm(false);

                $('#loader').addClass('d-none');
                $('#loader').removeClass('d-block');
                $(".wrapper").removeClass('back-opacity');
            }, 2000);
        } else {
            $('#loader').addClass('d-none');
            $('#loader').removeClass('d-block');
            $(".wrapper").removeClass('back-opacity');
        }
    });
};
