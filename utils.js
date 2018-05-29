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
    let invalidParams = [];
    if(req.query.from && req.query.to){
        if(req.query.from === "mgrs" && req.query.to === "decdeg"){
            if(!req.query.q){
                invalidParams.push('q');
            }
            if(invalidParams.length > 0){
                res.status(422).send(errorGenerator(invalidParams));
            }
            else{
                next();
            }
        }
        else{
            if(!req.query.lat){
                invalidParams.push('lat');
            }
            if(!req.query.lon){
                invalidParams.push('lon');
            }
            if(invalidParams.length > 0){
                res.status(422).send(errorGenerator(invalidParams));
            }
            else{
                next();
            }
        }
    }
    else{
        if(!req.query.from){
            invalidParams.push('from');
        }
        if(!req.query.to){
            invalidParams.push('to');
        }
        res.status(422).send(errorGenerator(invalidParams));
    }
    
}

function validate(res, result){
    if(!result.geometry){
        res.status(422).send(errorGenerator([], result));
    }
    else{
        res.send(result);
    }
}

/**
     * Return object to contain errors separated by comma.
     * @param {array} params - List of parameter errors
*/
function errorGenerator(params, error){
    if(params.length > 0){
        return { 'errors': 'invalid or missing parameter: ' + params.join(', ')};
    }
    else{
        return { 'errors': error };
    }
    
}

module.exports = {
    sanitize: sanitize,
    validate: validate
};