initializeListeners = function($, map) {
    map.on('click',function (event) {
        reverseGeocoding($, event.latlng['lat'], event.latlng['lng']);
    });

    $(document).on('reverse-geocoding-done', function(e, data){
        if (activeLocateMeInput !== null ) {
            activeLocateMeInput.value = data.display_name;
            $(document).trigger('display-popover', data.display_name);
        }
    });

    $(document).on('display-popover', function(e, data) {
        $(activeLocateMeInput).data('content', data);
    });

};
