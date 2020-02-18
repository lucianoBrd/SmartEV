window.onload = function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('.locate-me').on('click', function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            activeLocateMeInputID = $(this).data('input-id');
            activeLocateMeInput = $("#"+activeLocateMeInputID)[0];
        } else {
            activeLocateMeInput = null;
        }
    });
};