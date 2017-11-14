const converter = require("./geotransMgrsConverter");
const setenv= require('setenv');
setenv.set('MSPCCS_DATA', 'geotrans3.7/data');

EXAMPLE_MGRS_STRING = "12UUA8432340791";
EXAMPLE_DATUM = "WGE";

let myMgrsConverter = new converter(EXAMPLE_DATUM);
let exampleResult = myMgrsConverter.convert(EXAMPLE_MGRS_STRING);

console.log(exampleResult);