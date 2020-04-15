formatDistance = function (totalDistance) {
    /* Convert distance */
    if (totalDistance >= 1000) {
        /* In km */
        totalDistance = (totalDistance / 1000).toFixed(2) + " KM";

    } else {
        /* In m */
        totalDistance = totalDistance.toFixed(2) + " M";
    }
    return totalDistance;
};

formatTime = function (minutes) {
    /* Convert time */
    var h = Math.floor(minutes / 60);
    var m = Math.round(minutes % 60);
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;

    var string = (h == '00' ? '' : (h + ' H ')) + (m == '00' ? '' : (m + ' MN'));

    return string;
};

mtoKm = function (totalDistance) {
    totalDistance = (totalDistance / 1000).toFixed(2);

    return parseInt(totalDistance);
};
