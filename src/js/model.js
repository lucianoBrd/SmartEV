modelNotFound = function () {
    $('#carSelection').addClass('is-invalid');
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

    /* Find charges of the model */
    model.charges = null; // TODO

    return false;
};