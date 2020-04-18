/**
 * Display error on the form
 * @param {*} error
 */
showError = function (error) {
    var inputs = $('.input-location');

    $.each(inputs, function (key, input) {
        if (error) {
            $(input).addClass('is-invalid');
        } else {
            $(input).removeClass('is-invalid');
        }
    });

    var text = $('#input-error');
    if (error) {
        $(text).show();
    } else {
        $(text).hide();
    }
};