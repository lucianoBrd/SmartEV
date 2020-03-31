calculateChargeStep = function(instructions, coordinates) {
    var distance = 0, instruction, steps = [], charge;

    for(var i = 0; i<instructions.length; i++) {
        instruction = instructions[i];

        distance += instruction.distance / 1000; // convert meters to kilometers


        if (lowBattery(distance)){
            console.log(instruction);
            charge = findCloserChargePoint(coordinates[instruction.index].lat, coordinates[instruction.index].lng);

            if (charge) {
                steps.push(charge);
            }
            distance = 0;
        }
    }

    return steps;
};

findCloserChargePoint = function (lat, lng){
    var charge, chargeLat, chargeLng, point;
    var reference = {
        'lat': lat,
        'lng': lng
    };

    for(var i = 0; i<CHARGES.length; i++ ) {
        charge = CHARGES[i];
        chargeLat = charge.AddressInfo.Latitude;
        chargeLng = charge.AddressInfo.Longitude;

        point = {
            'lat': chargeLat,
            'lng': chargeLng
        };

        if (closeEnough(point, reference)) {
            return {
                'charge': charge,
                'lat': chargeLat,
                'lng': chargeLng
            };
        }
    }

    return false;
};

/*
* Campare two points and return true if the point is close enough than the reference point.
* point = { 'lat' : int; 'lng' : int}
* reference = { 'lat' : int; 'lng' : int}
*
* */
closeEnough = function(point, reference) {
    acceptableLat = {
        'min': reference['lat'] - CHARGE_RAD,
        'max': reference['lat'] + CHARGE_RAD
    };
    acceptableLng = {
        'min': reference['lng'] - CHARGE_RAD,
        'max': reference['lng'] + CHARGE_RAD
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




