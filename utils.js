/** 
 * Geotrans Server Utilities
 * @author Gibran Parvez
 * Last updated: 05/08/2018
 */

/**
     * Sanitize function. Detects parameter errors or missing parameters.
     * @param {object} req - Express request
     * @param {object} res - Express response
     * @param {function} next - Next function down the chain to be called.
*/
function sanitize (req, res, next) {
    let invalid = [];
    if(req.query.from && req.query.to){
        if(req.query.from === "mgrs" && req.query.to === "decdeg"){
            if(!req.query.q){
                invalid.push('q');
            }
            if(invalid.length > 0){
                res.status(422).send(errorGenerator(invalid));
            }
            else{
                next();
            }
        }
        else{
            if(!req.query.lat){
                invalid.push('lat');
            }
            if(!req.query.lon){
                invalid.push('lon');
            }
            if(invalid.length > 0){
                res.status(422).send(errorGenerator(invalid));
            }
            else{
                next();
            }
        }
    }
    else{
        if(!req.query.from){
            invalid.push('from');
        }
        if(!req.query.to){
            invalid.push('to');
        }
        res.status(422).send(errorGenerator(invalid));
    }
    
}

/**
     * Return object to contain errors separated by comma.
     * @param {array} params - List of parameter errors
*/
function errorGenerator(params){
    return { 'errors': 'invalid or missing parameter: ' + params.join(', ')};
}

module.exports = {
    sanitize: sanitize
};