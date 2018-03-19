const converter = require("./geotransMgrsConverter");
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send(convert(req)));

const port = process.env.PORT || '3000'
app.listen(port, () => console.log('GeoTrans MGRS Conversion service running at port ' + port));

function convert(req){
    if(req.query){
        let mgrs = new converter(req.query.datum);
        let result = mgrs.convert(req.query.coord);
        return result;
    }
}