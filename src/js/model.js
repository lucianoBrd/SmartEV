modelNotFound = function () {
    $('#carSelection').addClass('is-invalid');
};

findCharges = function () {
    /* For each station */
    $.each(CHARGES, function (key, station) {

        /* For each charger */
        $.each(station.Connections, function (key, charger) {

            /* For each id connection type of the model */
            $.each(model.charges.id, function (key, id) {

                /* Check if charger is compatible */
                if (charger.ConnectionTypeID == id) {
                    model.charges.list.push(station);
                }
            });
        });
    });
};

findModel = function () {
    var select = $('#carSelection');
    var selectedModel = $(select).val();
    var exist = false;

    /* Remove old errors */
    $(select).removeClass('is-invalid');

    /* Find the model and check if exist */
    $.each(models, function (key, brand) {
        $.each(brand, function (key, m) {
            if (m.name == selectedModel) {
                exist = true;
                model = m;
            }
        });
    });

    /* Model doesn't exist */
    if (!exist) {
        modelNotFound();
        return true;
    }

    /* Find charges compatible for the model */
    if (model.charges.list.length == 0) {
        findCharges();
    }

    return false;
};