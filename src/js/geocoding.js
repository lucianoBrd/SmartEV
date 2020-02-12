reverseGeocoding = function(lat, lng) {

    const url = "https://eu1.locationiq.com/v1/reverse.php?key="+locationIQToken+"&lat="+lat+"&lon="+lng+"&format=json";

    $.ajax({url: url, success: function(result){
            console.log(result);
    }});

};
