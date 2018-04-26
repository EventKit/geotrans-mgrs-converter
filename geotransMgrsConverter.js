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
    mgrsToDecDeg(mgrsString){
        let latitude, longitude;
        mgrsString = this.constructor.sanitize(mgrsString);
        if(mgrsString && this._datum && this.constructor.isValid(mgrsString)){
            let conversionResult = require("./build/Release/native.node").callConvertToGeodetic(mgrsString, this._datum);
            let convertedCoords = conversionResult.split(',');
            
            if(!convertedCoords[0]||!convertedCoords[1]){
                //pass back failed result
                return conversionResult;
            } else {
                //process successful result
                latitude = this.constructor.radiansToDegrees(convertedCoords[0]);
                longitude = this.constructor.radiansToDegrees(convertedCoords[1]);
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

    decDegToMgrs(latitude, longitude){
        if((latitude > -90 && latitude < 90) && (longitude > -180 && longitude < 180) && this._datum){
            let conversionResult = require("./build/Release/native.node").callConvertToMgrs(this.constructor.degreesToRadians(latitude), this.constructor.degreesToRadians(longitude), 1, this._datum);
            return this.constructor.generateJSON(conversionResult, latitude, longitude);
        }
        else{
            return "ERROR: Invalid Coordinate";
        }
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
                'coordinates': [longitude, latitude]
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