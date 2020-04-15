autocomplete = function () {
    /* Autocomplete */
    var typingTimer;
    var doneTypingInterval = 200; // 200ms
    var $input = $('.input-location');
    var list;
    var val;
    var $currentInput;

    /* On keyup, start the countdown */
    $input.on('keyup', function () {
        clearTimeout(typingTimer);

        list = $(this).attr('list');
        val = $(this).val();
        $currentInput = $(this);

        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    /* On keydown, clear the countdown */
    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

    function doneTyping() {
        if (!isEmpty(val)) {
            /* Get label linked to the input */
            var $label = $("label[for='" + $currentInput.attr('id') + "']");
            var iconClass   = null,
                iconPrefix  = null;
            if ($label.length > 0) {
                var $icon = $($label[0]).find('svg');
                if ($icon.length > 0) {
                    /* Save the class of the icon */
                    iconClass   = $icon.attr('data-icon');
                    iconPrefix  = $icon.attr('data-prefix');
                    /* Replace icon with loader */
                    changeIcon($label, true, iconClass, iconPrefix);
                }
            }

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

                /* Remove loader */
                changeIcon($label, false, iconClass, iconPrefix);
            }).fail(function (data) {
                /* Remove loader */
                changeIcon($label, false, iconClass, iconPrefix);
            });
        }
    }

    /* Check if string not empty or blank or contains only white-space */
    function isEmpty(str) {
        return (!str || 0 === str.length || /^\s*$/.test(str) || !str.trim());
    }

    /**
     * Change the icon of a label
     * If loader is true, put a loader icon animation
     * Else put the old icon
     * @param {*} $label 
     * @param {*} loader 
     * @param {*} iconClass 
     * @param {*} iconPrefix 
     */
    function changeIcon(
        $label, 
        loader, 
        iconClass, 
        iconPrefix
    ) {
        if (loader) {
            $label.empty();
            $label.append('<i class="fas fa-circle-notch fa-spin"></i>');
        } else {
            if (iconClass) {
                $label.empty();
                $label.append('<i class="' + iconPrefix + ' fa-' + iconClass + '"></i>');
            }
        }
    }
};
