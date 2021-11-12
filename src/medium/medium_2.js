import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: getAvgMpg(mpg_data),
    allYearStats: getAllYearStats(mpg_data),
    ratioHybrids: getHybridRatio(mpg_data),
};

function getAvgMpg(array) {
    let citySum = 0;
    let highwaySum = 0;
    for(let i = 0; i < array.length; i++) {
        citySum += array[i]["city_mpg"];
        highwaySum += array[i]["highway_mpg"];
    }
    return {'city':citySum/array.length, 'highway':highwaySum/array.length};
}

function getAllYearStats(array) {
    let allYears = [];
    for(let i = 0; i < array.length; i++) {
        allYears.push(array[i]["year"]);
    }
    return getStatistics(allYears);
}

function getHybridRatio(array) {
    let hybridCars = array.filter(car => car.hybrid == true);
    return hybridCars.length/array.length;
}

/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: getHybridsByMaker(mpg_data),
    avgMpgByYearAndHybrid: getMPGByYear(mpg_data),
};

function getHybridsByMaker(array) {
    let initialArray = [];
    var hybrids = array.reduce(
        function(previous, current) {
            if(current.hybrid === true) {
                var index = previous.map(c => c.make).indexOf(current.make);
                if(index != -1) {
                    previous[index].hybrids.push(current.id);
                } else {
                    previous.push({"make":current.make,"hybrids":[current.id]});
                }
            }
            return previous;
        }, initialArray
    );
    hybrids.sort(function(a, b) {
        if(a.hybrids.length > b.hybrids.length) {return -1;}
        if(a.hybrids.length < b.hybrids.length) {return 1;}
        return 0;
    });
    return hybrids;
}

function getMPGByYear(array) {
    let initialObject = {};
    var cars = array.reduce(
        function(previous, current) {
            if(!(current.year in previous)) {
                previous[current.year] = {
                    "hybrids":[],
                    "nonHybrids":[]
                }
            }
            if(current.hybrid === true) {
                previous[current.year].hybrids.push(current);
            } else {
                previous[current.year].nonHybrids.push(current);
            }
            return previous;
        }, initialObject
    );
    Object.keys(cars).forEach(c => cars[c].hybrids = getAvgMpg(cars[c].hybrids));
    Object.keys(cars).forEach(c => cars[c].nonHybrids = getAvgMpg(cars[c].nonHybrids));
    return cars;
}