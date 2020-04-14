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

            /* Compute time to charge the char and 
               add step to the routing for each steps */
            var time = 0;
            var waypointLength = this.getWaypoints().length;

            for (var i = 0; i < steps.length; i++) {
                var step = steps[i];
                
                /* Get the max power charger of the batterie */
                var powerCharger = null;
                $.each(step.charge.Connections, function (key, item) {
                    $.each(model.charges.id, function (key, id) {
                        if(id == item.id){
                            var pkw = item.PowerKW;
                            if (pkw) {
                                if(pkw > model.powerCharger) {
                                    /* Can't get more than the model */
                                    powerCharger = model.powerCharger;
                                } else {
                                    if(powerCharger) {
                                        if (powerCharger < pkw) {
                                            /* Get the more powerfull */
                                            powerCharger = pkw;
                                        }
                                    } else {
                                        powerCharger = pkw;
                                    }
                                }
                            }
                        }
                    });
                });

                if (!powerCharger) {
                    powerCharger = model.powerCharger;
                }

                /* Compute time */
                var t = computeTime(
                    step.socCurrent,
                    powerCharger,
                    model.battery
                );
                time += t;

                /* Add marker */
                var display_name = '<h3>Pause de ' + formatTime(t) + '</h3>';
                display_name += '<p>En arrivant, la batterie de la carlingue ' + model.name + ' sera de ' + Math.round(step.socCurrent) + '%</p>';
                display_name += '<p>Profitez en pour ' + relaxation[Math.floor(Math.random() * relaxation.length)] + '</p>';

                this.spliceWaypoints(
                    waypointLength - 1,
                    0,
                    L.Routing.waypoint(
                        L.latLng(step.lat, step.lng),
                        display_name
                    )
                );
            }

            /* Add to trip time */
            tripTime += time;

            /* Convert time */
            var totalTime = formatTime(tripTime);

            /* Update trip time in the page  */
            var tt = $('#trip-time');
            if (tt) {
                $(tt).text(totalTime);
            }
        });

        routing.route();
        routing._container.style.display = "None";

    });
};
