calculateChargeStep = function(instructions, coordinates, totalDistance) {
    if ((totalDistance/1000) > model.autonomy) {
        var numberOfSteps = Math.round((totalDistance/1000) / model.autonomy);
        var continuousAverage = (totalDistance/1000) / numberOfSteps;
        if (continuousAverage >= model.autonomy) continuousAverage = (totalDistance/1000) / (numberOfSteps + 1);
        var distance = 0, j=1, charge = false, steps = [];

        for (var i = 0; i<instructions.length; i++) {
            instruction = instructions[i];

            distance += instruction.distance / 1000;
            nextInstruction = instructions[i+1];

            if (nextInstruction !== undefined) {
                nextDistance = distance + (nextInstruction.distance /1000);

                if ((distance <= continuousAverage && nextDistance >= continuousAverage) || distance >= continuousAverage) {

                    middleIndex = Math.round((instruction.index + nextInstruction.index)/2);

                    while(!charge) {
                        charge = findCloserChargePoint(coordinates, middleIndex, CHARGE_POINT_RANGE*j);
                        j++;

                        if( j > 1000) {
                            break;
                        }
                    }
                    j = 0;

                    if(charge) {
                        steps.push(charge);
                    }

                    distance = 0;
                    charge = false;
                }
            }
        }
        return steps;
    }

    return [];
};

findCloserChargePoint = function (coordinates, middleIndex, chargePointsRange){
    var charge, chargeLat, chargeLng, point;
    var selectedPoint = false;
    var selectedPointComparator = {
        'latDifference' : 1000,
        'lngDifference' : 1000
    };
    var chargers = model.charges.list;

    var reference;

    for (var j = middleIndex-chargePointsRange; j< middleIndex + chargePointsRange; j++) {
        if(coordinates[j] !== undefined) {
            reference = {
                'lat': coordinates[j].lat,
                'lng': coordinates[j].lng
            };

            for(var i = 0; i<chargers.length; i++) {
                charge = chargers[i];
                chargeLat = charge.AddressInfo.Latitude;
                chargeLng = charge.AddressInfo.Longitude;

                point = {
                    'lat': chargeLat,
                    'lng': chargeLng
                };

                if (closeEnough(point, reference, CHARGE_RAD)) {
                    latDifference = Math.abs(reference.lat - chargeLat);
                    lngDifference = Math.abs(reference.lng - chargeLng);

                    if (latDifference < selectedPointComparator.latDifference && lngDifference < selectedPointComparator.lngDifference) {
                        selectedPointComparator.latDifference = latDifference;
                        selectedPointComparator.lngDifference = lngDifference;

                        selectedPoint = {
                            'charge': charge,
                            'lat': chargeLat,
                            'lng': chargeLng
                        };
                    }
                    break;
                }
            }
        }
    }

    return selectedPoint;
};

/*
* Campare two points and return true if the point is close enough than the reference point.
* point = { 'lat' : int; 'lng' : int}
* reference = { 'lat' : int; 'lng' : int}
*
* */
closeEnough = function(point, reference, charges_rad) {
    acceptableLat = {
        'min': reference['lat'] - charges_rad,
        'max': reference['lat'] + charges_rad
    };
    acceptableLng = {
        'min': reference['lng'] - charges_rad,
        'max': reference['lng'] + charges_rad
    };

    var latIsOk = (point['lat'] >= acceptableLat['min'] && point['lat'] <= acceptableLat['max']);
    var lngIsOk = (point['lng'] >= acceptableLng['min'] && point['lng'] <= acceptableLng['max']);

    return (latIsOk && lngIsOk);
};

lowBattery = function(distance){
    var autonomy = model.autonomy;

    var critical = autonomy/SAFE_PERCENTAGE;

    return (autonomy - distance <= critical);
};




