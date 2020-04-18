/**
 * Get an information popup for a charge marker
 */
informationPopup = function (charge) {
    var popup = '';
    popup += '<div>';

    /* Add a title */
    if (charge.AddressInfo.Title) {
        popup += '<h2>';
        popup += charge.AddressInfo.Title;
        popup += '</h2>';
    }

    /* Add the address */
    if (charge.AddressInfo.AddressLine1 || charge.AddressInfo.Town) {
        popup += '<p>';
        if (charge.AddressInfo.AddressLine1) {
            popup += charge.AddressInfo.AddressLine1;
        }
        if (charge.AddressInfo.AddressLine1 && charge.AddressInfo.Town) {
            popup += ', ';
            popup += charge.AddressInfo.AddressLine1;
        }
        if (charge.AddressInfo.Town) {
            popup += charge.AddressInfo.Town;
        }
        popup += '</p>';
    }

    /* Add the general post code */
    if (charge.AddressInfo.Postcode) {
        popup += '<p>';
        popup += charge.AddressInfo.Postcode;
        popup += '</p>';
    }

    /* Add the general comment */
    if (charge.AddressInfo.GeneralComments) {
        popup += '<p>';
        popup += charge.AddressInfo.GeneralComments;
        popup += '</p>';
    }

    /* Add information about the connector */
    $.each(charge.Connections, function (i, item) {

        popup += '<h3>Chargeur ' + (i + 1) + '</h3>';

        if (item.ConnectionType && item.ConnectionType.Title) {
            popup += '<p>';
            popup += 'Type : '
            popup += item.ConnectionType.Title;
            popup += '</p>';
        } /* Type of connector */

        if (item.PowerKW) {
            popup += '<p>';
            popup += 'Puissance : '
            popup += item.PowerKW;
            popup += ' KW';
            popup += '</p>';

        } /* Power of connector */
    });

    popup += '</div>';
    return popup;
};

createCluster = function (map, charges) {
    /* Create the icon marker */
    var markerIcon = L.icon({
        iconUrl: 'public/images/charger.png',

        iconSize: [38, 38], // size of the icon
        iconAnchor: [22, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -20] // point from which the popup should open relative to the iconAnchor

    });

    /* Create the cluster group */
    markers = L.markerClusterGroup();

    $.each(charges, function (i, item) {
        var marker =
            L.marker(
                [
                    item.AddressInfo.Latitude,
                    item.AddressInfo.Longitude
                ],
                { icon: markerIcon }
            ).bindPopup(
                informationPopup(item)
            );

        markers.addLayer(marker);

    });

        map.addLayer(
            markers
        );
};

initializeMarker = function (map) {
    $('#model-marker').click(function () {
        $(this).toggleClass('active');

        /* Remove cluster of marker */
        if (markers != null) {
            map.removeLayer(markers);
        }

        /* Add markers */
        if ($(this).hasClass('active')) {
            /* Model case */
            createCluster(map, model.charges.list);
        } else {
            /* Normal case */
            createCluster(map, CHARGES);
        }
    });
};

createTripStepMarkers = function (steps, waypointLength, routing) {
    var time = 0;

    for (var i = 0; i < steps.length; i++) {
        var step = steps[i];

        /* Get the max power charger of the batterie */
        var powerCharger = null;
        $.each(step.charge.Connections, function (key, item) {
            $.each(model.charges.id, function (key, id) {
                if (id == item.id) {
                    var pkw = item.PowerKW;
                    if (pkw) {
                        if (pkw > model.powerCharger) {
                            /* Can't get more than the model */
                            powerCharger = model.powerCharger;
                        } else {
                            if (powerCharger) {
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
        if (t > 0) {
            var display_name = '<h3>Pause de ' + formatTime(t) + '</h3>';
            display_name += '<p>En arrivant, la batterie de la carlingue ' + model.name + ' sera de ' + Math.round(step.socCurrent) + '%</p>';
            display_name += '<p>Profitez en pour ' + relaxation[Math.floor(Math.random() * relaxation.length)] + '</p>';

        } else {
            var display_name = '<h3>Une pause s\'impose</h3>';
            display_name += '<p>Malheureusement nous n\'avons pas trouvé de chargeur plus proche.</p>';
            display_name += '<p>En arrivant, la batterie de la carlingue ' + model.name + ' sera de ' + (100 - Math.round(step.socCurrent)) + '%</p>';
        }

        routing.spliceWaypoints(
            waypointLength - 1,
            0,
            L.Routing.waypoint(
                L.latLng(step.lat, step.lng),
                display_name
            )
        );
    }

    return time;
};
