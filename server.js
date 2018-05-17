/** 
 * Geotrans Server
 * @author Gibran Parvez
 * Last updated: 05/08/2018
 */

const converter = require("./geotransMgrsConverter"),
    express = require('express'),
    sanitize = require('./utils').sanitize,
    app = express(),
    port = process.env.PORT || '3000';

//Middleware for sanitize/error-checking
app.use(sanitize);
app.get('/', convert);
app.listen(port, () => console.log('GeoTrans Conversion service running at port ' + port));


/**
     * Convert function. Determines which Geotrans conversion to perform based on given REST coordinates.
     * @param {object} req - Express request
     * @param {object} res - Express response
*/

function convert(req){
    if(req.query){
        if(!req.query.datum){
            req.query.datum = 'WGE';
        }
        if(req.query.from === "mgrs" && req.query.to === "decdeg"){
            let mgrs = new converter(req.query.datum);
            let result = mgrs.mgrsToDecDeg(req.query.q);
            return result;
        }
        else if(req.query.from === "decdeg" && req.query.to === "mgrs"){
            let mgrs = new converter(req.query.datum);
            let result = mgrs.decDegToMgrs(req.query.lat, req.query.lon, 0);
            return result;
        }

    }
    let converterInstance = new converter(req.query.datum);
    if(req.query.from === "mgrs" && req.query.to === "decdeg"){
        res.send(converterInstance.mgrsToDecDeg(req.query.q));
    }
    else if(req.query.from === "decdeg" && req.query.to === "mgrs"){
        res.send(converterInstance.decDegToMgrs(req.query.lat, req.query.lon, 1));

    }
    else{
        res.status(422).send({'errors': 'coordinate type not supported'});
    }
}

module.exports = { 
    convert: convert
};