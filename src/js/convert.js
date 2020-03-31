distance = function (totalDistance) {
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

time = function (totalTime) {
    /* Convert time */
    if (totalTime >= 60) {
        /* In h */
        totalTime = (totalTime / 60).toFixed(2) + " H";

    } else {
        /* In mn */
        totalTime = totalTime.toFixed(2) + " MN";
    }
    return totalTime;
};

mtoKm = function (totalDistance) {
    totalDistance = (totalDistance / 1000).toFixed(2);

    return parseInt(totalDistance);
};
