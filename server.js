const converter = require("./geotransMgrsConverter");
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send(convert(req)));

app.listen(3150, () => console.log('GeoTrans MGRS Conversion service running at port 3150'));

function convert(req){
    if(req.query){
        let mgrs = new converter(req.query.datum);
        let result = mgrs.convert(req.query.coord);
        return result;
    }
}