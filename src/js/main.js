jQuery = require('jquery');
$ = require('jquery');

jQuery(function ($) {

    /* Create the map */
    var map = L.map('mapid').setView([lat, lng], 5);

    /* Initialize maps */
    loadMaps(map);

    /* Load charges */
    loadCharges(map);


    map.on('click',function (event) {
        reverseGeocoding(event.latlng['lat'], event.latlng['lng']);
    })

});
