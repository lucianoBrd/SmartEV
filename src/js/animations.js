window.onload = function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('.locate-me').on('click', function() {
        if(!locateMeIsActive) {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                activeLocateMeInputID = $(this).data('input-id');
                activeLocateMeStep = $(this).data('step');
                activeLocateMeInput = $("#"+activeLocateMeInputID)[0];
                locateMeIsActive = true;
            } else {
                activeLocateMeInput = null;
                activeLocateMeInputID = null;
                activeLocateMeStep = null;
                locateMeIsActive = false;
            }
        } else {
            if($(this).data('step') === activeLocateMeStep) {
                resetLocateMe();
            }
        }
    });

    $('.collapse-handler').on('click', function(){
        var collapseId = $(this).data('collapse');
        $('.collapsible[data-collapse-id='+collapseId+']').toggleClass('d-none');
        $('i[data-icon='+collapseId+']').toggleClass('fa-caret-right');
        $('i[data-icon='+collapseId+']').toggleClass('fa-caret-down');
    });
};

resetLocateMe = function() {
    //unable locate me listener
    $(".locate-me[data-step="+activeLocateMeStep+"]").toggleClass('active');
    activeLocateMeStep = null;
    activeLocateMeInput = null;
    activeLocateMeInputID = null;
    locateMeIsActive = false;
};
