/**
 * Initialize the map with the position of the user
 */
loadMaps = function (map) {
    /* Load the map */
    L.tileLayer(URLS['loadMap'], {
        attribution: 'Redwan Kara, Burdet Lucien',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: token
    }).addTo(map);

    /* Create the icon marker */
    var markerIcon = L.icon({
        iconUrl: 'public/images/marker.png',

        iconSize: [38, 38], // size of the icon
        iconAnchor: [22, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -20] // point from which the popup should open relative to the iconAnchor

    });

    /* Locate the user */
    map.locate({
        setView: true,
        maxZoom: 12
    }).on('locationfound', function (e) {
        lat = e.latitude;
        lng = e.longitude;

        var marker = L.marker(
            [lat, lng],
            { icon: markerIcon }
        ).bindPopup('Vous êtes ici en somme');

        var circle = L.circle([lat, lng], e.accuracy / 2, {
            weight: 1,
            color: 'red',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        });
        map.addLayer(marker);
        map.addLayer(circle);

        /* Change the map center to the location */
        map.flyTo([lat, lng], 12)

    }).on('locationerror', function (e) {
        lat = 45.75;
        lng = 4.85;
    });
}

/**
 * Load charges
 */
loadCharges = function (map) {
    /* Create the icon marker */
    var markerIcon = L.icon({
        iconUrl: 'public/images/charger.png',

        iconSize: [38, 38], // size of the icon
        iconAnchor: [22, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -20] // point from which the popup should open relative to the iconAnchor

    });

    var markers = L.markerClusterGroup();

    /* Request to get the charges */
    $.ajax({
        url: URLS['charges']
    }).done(function (data) {

        /* Parse data to json */
        var chargeData = data;
        if (chargeData) {
            chargeData = JSON.parse(
                JSON.stringify(data)
            );
        }
        $.each(chargeData, function (i, item) {
            marker =
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
            map.addLayer(
                markers
            );
        });


    }).fail(function (data) {
        console.log(data);
    });
}

/**
 * Get an information popup for a charge marker
 */
informationPopup = function (charge) {
    var popup = '';
    popup += '<div>';

    /* Add a title */
    popup += '<p>';
    popup += charge.AddressInfo.Title;
    popup += '</p>';

    /* Add the address */
    popup += '<p>';
    popup += charge.AddressInfo.AddressLine1 + ', ' + charge.AddressInfo.Town;
    popup += '</p>';

    /* Add the general comment */
    if (charge.AddressInfo.GeneralComments) {
        popup += '<p>';
        popup += charge.AddressInfo.GeneralComments;
        popup += '</p>';
    }

    popup += '</div>';
    return popup;
}