/** 
 * Geotrans Converter
 * @module geotransMgrsConverter
 * @author Gibran Parvez
 * Last updated: 05/08/2018
 */

"use strict";

const native = require('bindings')('native');

class MgrsConverter {
    constructor(datum){
        this._datum = datum;
        
    }
    /**
     * Convert function. Primary usage of this module.
     * @param {string} mgrsString - Alpha-numeric system for expressing UTM / UPS coordinates.
     */
    mgrsToDecDeg(mgrsString){
        let latitude, longitude, height;
        mgrsString = this.constructor.sanitize(mgrsString);
        if(mgrsString && this._datum && this.constructor.isValid(mgrsString)){
            let conversionResult = require("./build/Release/native.node").callConvertToGeodetic(mgrsString, this._datum);
            let convertedCoords = conversionResult.split(',');
            
            if(!convertedCoords[0]||!convertedCoords[1]){
                //pass back failed result
                return conversionResult;
            } else {
                //process successful result
                latitude = this.constructor.precisionRound(this.constructor.radiansToDegrees(convertedCoords[0]), 5);
                longitude = this.constructor.precisionRound(this.constructor.radiansToDegrees(convertedCoords[1]), 5);
                return this.constructor.generateJSON(mgrsString, latitude, longitude);
            }
        }
        else{
            console.error("Unable to convert.");
            if(mgrsString){
                console.log(mgrsString + " is not a valid MGRS coordinate.");
            }
            else{
                console.log("Valid MGRS coordinate not supplied");
            }
            return "ERROR: Invalid MGRS String";
        }
    }

    /**
     * Convert function. Primary usage of this module.
     * @param {number} latitude - Alpha-numeric system for expressing geodetic latitude coordinate.
     * @param {number} longitude - Alpha-numeric system for expressing geodetic longitude coordinate.
     * @return {object} - geojson object featuring calculated MGRS string as property.
     */
    decDegToMgrs(latitude, longitude){
        latitude = this.constructor.precisionRound(latitude, 5);
        longitude = this.constructor.precisionRound(longitude, 5);
        if((latitude > -90 && latitude < 90) && (longitude > -180 && longitude < 180) && this._datum){
            let conversionResult = require("./build/Release/native.node").callConvertToMgrs(
                this.constructor.degreesToRadians(latitude), 
                this.constructor.degreesToRadians(longitude), 
                0, 
                this._datum);

            return this.constructor.generateJSON(conversionResult, latitude, longitude);
        }
        else{
            return "ERROR: Invalid Coordinate";
        }
    }
    /**
    * Emulate rounding to the same precision as the Geotrans Java spp.
    * @param {number} radians 
    */
    static precisionRound(number, precision) {
        var shift = function (number, precision) {
          var numArray = ("" + number).split("e");
          return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
        };
        return shift(Math.round(shift(number, +precision)), -precision).toFixed(precision);
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
    * Simple converter from degrees to radians.
    * @param {number} degrees 
    */
    static degreesToRadians(degrees){
        let pi = Math.PI;
        return degrees * (pi/180);
     }
    /**
     * GeoJSON Point generator
     */
    static generateJSON(mgrsString, latitude, longitude){
        return {
            'type':'Feature',
            'geometry':{
                'type':'Point',
                'coordinates': [parseFloat(longitude), parseFloat(latitude)]
            },
            'properties':{
                'name':mgrsString
            }
        };
    }
    /**
     * Validity checker
     */
    static isValid(mgrsString){
        let regex = /^(\d{1,2})([C-HJ-NP-X])\s*([A-HJ-NP-Z])([A-HJ-NP-V])\s*(\d{1,5}\s*\d{1,5})$/i;
        let firstDigit, valid = false;
        if(regex.test(mgrsString)){
            for(let i=mgrsString.length-1; i>=0; i--){
                if(/^\d+$/.test(mgrsString[i])){
                    firstDigit = i;
                }
                else{
                	break;
                }
            }
            if(mgrsString.substring(firstDigit).length % 2 === 0){
                valid = true;
            }
        }
        return valid;
    }
    /**
     * Sanitizer
     * Make uppercase, remove spaces
     */
    static sanitize(mgrsString){
        mgrsString.toUpperCase();
        return mgrsString.replace(/\s+/g, '');
    }
}

module.exports = MgrsConverter;