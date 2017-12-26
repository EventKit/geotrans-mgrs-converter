/** 
 * Example usage
 * @author Gibran Parvez
 * Last updated: 11/15/2017
 */
const converter = require("./geotransMgrsConverter");
//const setenv= require('setenv');
//setenv.set('MSPCCS_DATA', 'geotrans3.7/data');

//Constant for test
EXAMPLE_MGRS_STRING = "12UUA843234079";
EXAMPLE_DATUM = "WGE";
TEST_STRINGS = ["12UUA843234079", "4CFG","12UUA8440", "18TXM9963493438","12UAZ"]

//Instantiate new converter
let myMgrsConverter = new converter(EXAMPLE_DATUM);

performConvert = function(string){
    console.log(myMgrsConverter.convert(string));
};

for(let coord in TEST_STRINGS){
    performConvert(TEST_STRINGS[coord]);
}