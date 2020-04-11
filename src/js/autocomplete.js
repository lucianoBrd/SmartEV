autocomplete = function () {
    /* Autocomplete */
    var typingTimer;
    var doneTypingInterval = 200; // 200ms
    var $input = $('.input-location');
    var list;
    var val;

    /* On keyup, start the countdown */
    $input.on('keyup', function () {
        clearTimeout(typingTimer);

        list = $(this).attr('list');
        val = $(this).val();

        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    /* On keydown, clear the countdown */
    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

    function doneTyping () {
        if (!isEmpty(val)) {

            $.ajax({
                url: URLS['searchGeocoding'] + locationIQToken + "&limit=5&format=json&q=" + val
            }).done(function (data) {

                /* Get the datalist */
                var datalist = $('#' + list);
                
                /* Remove all child */
                $(datalist).empty();

                /* Parse data to json */
                var geocod = data;
                if (geocod) {
                    geocod = JSON.parse(
                        JSON.stringify(data)
                    );
                }

                $.each(geocod, function (i, item) {
                    /* Add option */
                    $(datalist).append('<option value="' + item.display_name + '" >');

                    if (i == 0) {
                        /* Save the lat and lng */
                        $(document).trigger('load-' + list.split('-')[0], item);
                    } 
                });
            }).fail(function (data) {
                console.log(data);
            });
        }
    }

    /* Check if string not empty or blank or contains only white-space */
    function isEmpty(str) {
        return (!str || 0 === str.length || /^\s*$/.test(str) || !str.trim());
    }
};
