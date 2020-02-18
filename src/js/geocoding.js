reverseGeocoding = function($, lat, lng) {

    var url = URLS['reverseGeocoding']+locationIQToken+"&lat="+lat+"&lon="+lng+"&format=json";

    $.ajax({url: url, success: function(result){
            console.log(result);
            $(document).trigger("reverse-geocoding-done", result);
    }});
};
