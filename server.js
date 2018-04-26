const converter = require("./geotransMgrsConverter");
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send(convert(req)));

const port = process.env.PORT || '3000'
app.listen(port, () => console.log('GeoTrans MGRS Conversion service running at port ' + port));

function convert(req){
    if(req.query){
        if(req.query.from === "mgrs" && req.query.to === "decdeg"){
            let mgrs = new converter(req.query.datum);
            let result = mgrs.mgrsToDecDeg(req.query.q);
            return result;
        }
        else if(req.query.from === "decdeg" && req.query.to === "mgrs"){
            let mgrs = new converter(req.query.datum);
            let result = mgrs.decDegToMgrs(req.query.lat, req.query.lon, 1);
            return result;
        }
    }
    
}