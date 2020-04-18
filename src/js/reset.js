reset = function () {
    /* Remove road sheet info */
    $('.roadSheetList').empty();
    $('#trip-info-body').empty();

    /* Form */
    $('#search-trip').text('Rechercher');
    $('.input-location').val('');
    $('.locate-me-icon').addClass('locate-me');

    /* Trip info */
    $("#trip-container").addClass("d-none");
    $("#trip-container").removeClass("d-flex");
    $("#trip-info-container").addClass("d-none");
    $("#trip-info-container").removeClass("d-flex");
    $("#road-sheet-container").addClass("d-none");
    $("#road-sheet-container").removeClass("d-flex");

    /* Reset trip location */
    $.each(TRIP, function (key, item) {
        item['lat'] = null;
        item['lng'] = null;
    });

    /* Remove the router */
    if (routing) {
        routing.getPlan().setWaypoints({latLng: L.latLng([0, 0])});
        routing = null;
    }

    /* Reset trip time */
    tripTime = 0;
};

statusForm = function (active) {
    /* Change form status */
    if (active) {
        $('#search-trip').text('Annuler');
        $('.locate-me-icon').removeClass('locate-me');
    } else {
        reset();
    }

    $('#carSelection').prop("disabled", active);
    $('.input-location').prop("disabled", active);
    activeTrip = active;
};
