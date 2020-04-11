/**
 * Find SOC overcome by power of charger
 */
var socP = function (power) {
    var soc = -1;

    if (power >= 0 && power < 10) {
        soc = 98;
    } else if (power >= 10 && power < 15) {
        soc = 95;
    } else if (power >= 15 && power < 20) {
        soc = 92;
    } else if (power >= 20 && power < 25) {
        soc = 88;
    } else if (power >= 25 && power < 30) {
        soc = 85;
    } else if (power >= 30 && power < 35) {
        soc = 83;
    } else if (power >= 35 && power < 40) {
        soc = 81;
    } else if (power >= 40) {
        soc = 75;
    }

    return soc;
};

/**
 * Compute the time of an overcome
 * @param {*} socO 
 * @param {*} socC 
 * @param {*} battery 
 * @param {*} pc 
 * @return time in minutes
 */
var computeOvercome = function (
    socO,
    socC,
    battery,
    pc
) {
    return 60 * ((socO - socC) / 100) * battery / pc;
};

/**
 * Compute the time to charge the battery of the car to 100%
 * @param {*} socCurrent
 * @param {*} powerCharger
 * @param {*} battery
 * @return time in minutes
 */
computeTime = function (
    socCurrent,
    powerCharger,
    battery
) {
    var socOvercome = socP(powerCharger);
    var time = 0;
    var pc = powerCharger;

    /* First overcome */
    if (socCurrent < socOvercome) {
        time = computeOvercome(
            socOvercome,
            socCurrent,
            battery,
            pc
        );
    }

    /* Second overcome */
    pc = 0.75 * powerCharger;
    if (socCurrent < socOvercome) {
        time += computeOvercome(
            (socOvercome + 100) / 2,
            socOvercome,
            battery,
            pc
        );
    } else if (socCurrent < (socOvercome + 100) / 2) {
        time += computeOvercome(
            (socOvercome + 100) / 2,
            socCurrent,
            battery,
            pc
        );
    }

    /* 3 overcome */
    pc = 0.5 * powerCharger;
    if (socCurrent < (socOvercome + 100) / 2) {
        time += computeOvercome(
            (socOvercome + 500) / 6,
            (socOvercome + 100) / 2,
            battery,
            pc
        );
    } else if (socCurrent < (socOvercome + 500) / 6) {
        time += computeOvercome(
            (socOvercome + 500) / 6,
            socCurrent,
            battery,
            pc
        );
    }

    /* 4 overcome */
    pc = 0.25 * powerCharger;
    if (socCurrent < (socOvercome + 500) / 6) {
        time += computeOvercome(
            100,
            (socOvercome + 500) / 6,
            battery,
            pc
        );
    } else if (socCurrent < 100) {
        time += computeOvercome(
            100,
            socOvercome,
            battery,
            pc
        );
    }

    return time;

};