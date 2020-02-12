jQuery = require('jquery');
$ = require('jquery');

jQuery(function ($) {

    /* Create the map */
    var map = L.map('mapid').setView([lat, lng], 5);

    /* Create the icon marker */
    var markerIcon = L.icon({
        iconUrl: 'public/images/marker.png',

        iconSize:     [38, 38], // size of the icon
        iconAnchor:   [22, 37], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -20] // point from which the popup should open relative to the iconAnchor

    });

    /* Load the map */
    L.tileLayer(URLS['loadMap'], {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: token
    }).addTo(map);

    /* Locate the user */
    map.locate({
        setView: true,
        maxZoom: 12
    }).on('locationfound', function (e) {
        lat = e.latitude;
        lng = e.longitude;

        var marker = L.marker(
            [lat, lng], 
            {icon: markerIcon}
        ).bindPopup('Vous êtes ici en somme');

        var circle = L.circle([lat, lng], e.accuracy / 2, {
            weight: 1,
            color: 'red',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        });
        map.addLayer(marker);
        map.addLayer(circle);

    }).on('locationerror', function (e) {
        lat = 45.75;
        lng = 4.85;
    });

    $.ajax({
        url: URLS['charges']
    }).done(function (data) {
        $.each(data, function(i, item) {
            map.addLayer(
                L.marker([
                    item.AddressInfo.Latitude,
                    item.AddressInfo.Longitude
                ])
            );
        });
    });

});
