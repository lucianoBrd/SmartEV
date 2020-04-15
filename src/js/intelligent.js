/*
* This function is the main algorithm for finding charges points in a trip. It calculate if the user needs to charge and if yes, return a list of charge points
* */
calculateChargeStep = function(instructions, coordinates, totalDistance) {
    //if the distance is lower than the autonomy, we don have to find any charge point
    if ((mtoKm(totalDistance)) > model.autonomy) {
        var distance = 0, j=1, charge = false, steps = [];

        //calculate approximate number of steps
        var numberOfSteps = Math.round((mtoKm(totalDistance)) / model.autonomy);

        //then calculate the average of km the user will do before charging
        var continuousAverage = (mtoKm(totalDistance)) / numberOfSteps;
        if (continuousAverage >= model.autonomy) continuousAverage = (mtoKm(totalDistance)) / (numberOfSteps + 1);

        //for each instructions of the road plan
        for (var i = 0; i<instructions.length; i++) {
            instruction = instructions[i];

            //we add the distance to a counter, to see when he should stop
            distance += mtoKm(instruction.distance);

            //if there is a next instruction
            nextInstruction = instructions[i+1];

            if (nextInstruction !== undefined) {
                //we take the next distance (accumulated)
                nextDistance = distance + (mtoKm(nextInstruction.distance));

                //and if between those 2 instructions the user exceed the average
                if ((distance <= continuousAverage && nextDistance >= continuousAverage) || distance >= continuousAverage) {

                    //then we take the middle point of those instructions (with index see leaflet doc)
                    middleIndex = Math.round((instruction.index + nextInstruction.index)/2);

                    //and we find the closer charge point on the road
                    while(!charge) {
                        charge = findCloserChargePoint(coordinates, middleIndex, CHARGE_POINT_RANGE*j);
                        j++;

                        if( j > 1000) {
                            break;
                        }
                    }
                    j = 0;

                    //then we add this charge point to the steps
                    if(charge) {
                        /* Compute the percentage of battery */
                        var d = (distance >= continuousAverage) ? (distance) : ((distance + nextDistance) / 2);
                        d = d / model.autonomy;
                        charge.socCurrent = d * 100;

                        steps.push(charge);
                    }

                    //and reset the distance
                    distance = 0;
                    charge = false;
                }
            }
        }

        //finally return the charge points
        return steps;
    }

    return [];
};


/*
* This function find the closer charge point from a reference point (lat and lng)
* */
findCloserChargePoint = function (coordinates, middleIndex, chargePointsRange){
    //initialize variables
    var charge, chargeLat, chargeLng, point, reference;
    var selectedPoint = false;
    var selectedPointComparator = {
        'latDifference' : 1000,
        'lngDifference' : 1000
    };

    //take only the chargers which fit with the car the user chose
    var chargers = model.charges.list;

    //We got a range of indexes corresponding to coordinates indexes
    //this range is defined in params
    //for each couple of this range
    for (var j = middleIndex-chargePointsRange; j< middleIndex + chargePointsRange; j++) {
        //if there are corresponding coordinates in the array
        if(coordinates[j] !== undefined) {
            //we set the currant point as the reference
            //it is around this point we will search the charge points
            reference = {
                'lat': coordinates[j].lat,
                'lng': coordinates[j].lng
            };

            //then for each chargers
            for(var i = 0; i<chargers.length; i++) {

                //we get the object, the lat and lng (for clarity)
                charge = chargers[i];
                chargeLat = charge.AddressInfo.Latitude;
                chargeLng = charge.AddressInfo.Longitude;

                //and create a point
                point = {
                    'lat': chargeLat,
                    'lng': chargeLng
                };

                //and if the current charger is close enough from the reference point
                if (closeEnough(point, reference, CHARGE_RAD)) {
                    //then we calculate the difference between the charger and our position
                    latDifference = Math.abs(reference.lat - chargeLat);
                    lngDifference = Math.abs(reference.lng - chargeLng);

                    //in order to compare which charger and which position are the closer
                    //if the difference are better, then we choose this point as the better one
                    if (latDifference < selectedPointComparator.latDifference && lngDifference < selectedPointComparator.lngDifference) {
                        selectedPointComparator.latDifference = latDifference;
                        selectedPointComparator.lngDifference = lngDifference;

                        selectedPoint = {
                            'charge': charge,
                            'lat': chargeLat,
                            'lng': chargeLng,
                            'socCurrent': null
                        };
                    }
                    break;
                }
            }
        }
    }

    //finally, we checked for a range of positions, every chargers around and select the closer one
    //we return it
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




