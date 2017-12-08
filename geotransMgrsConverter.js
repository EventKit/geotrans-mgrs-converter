/** 
 * Geotrans MGRS Converter
 * @module geotransMgrsConverter
 * @author Gibran Parvez
 * Last updated: 11/14/2017
 */
"use strict";
//const setenv= require('setenv');
const native = require('bindings')('native');
//Required by mgrsToGeodetic.cpp for ellipsoid reference data
//setenv.set('MSPCCS_DATA', 'geotrans3.7/data');


class MgrsConverter {
    constructor(datum){
        this._datum = datum;
        
    }
    /**
     * Convert function. Primary usage of this module.
     * @param {string} mgrsString - Alpha-numeric system for expressing UTM / UPS coordinates.
     */
    convert(mgrsString){
        const MGRS = /^(\d{1,2})([C-HJ-NP-X])\s*([A-HJ-NP-Z])([A-HJ-NP-V])\s*(\d{1,5}\s*\d{1,5})$/i;
        let decDegResult = null;
        if(mgrsString && this._datum && MGRS.test(mgrsString)){
            let conversionResult = this.callLibrary(mgrsString);
            decDegResult = {
                "mgrsString": mgrsString,
                "latitude": this.constructor.radiansToDegrees(conversionResult[0]),
                "longitude": this.constructor.radiansToDegrees(conversionResult[1])
            };
        }
        else{
            console.error("Unable to convert.");
            if(mgrsString){
                console.log(mgrsString + " is not a valid MGRS coordinate.");
            }
            decDegResult = {
                "mgrsString": mgrsString || "No MGRS coordinate supplied",
                "latitude": null,
                "longitude": null
            };

        }
        return decDegResult;
    }
    /**
    * Simple converter from radians to degrees.
    * @param {number} radians 
    */
    static radiansToDegrees(radians){
       let pi = Math.PI;
       return radians * (180/pi);
    }
    /**
    * Calls C++ function "convertToGeodetic" in mgrsToGeodetic. Values passed in from 'convert' function above.
    * @param {string} mgrsString
    */
    callLibrary(mgrsString){ 
        return require("./build/Release/native.node").callConvertToGeodetic(mgrsString, this._datum).split(',');
    }
}

module.exports = MgrsConverter;