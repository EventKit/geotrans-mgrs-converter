const jasmine = require('jasmine');
const converter = require("./geotransMgrsConverter");
const EXAMPLE_DATUM = "WGE";
const converterInstance = new converter(EXAMPLE_DATUM);

describe("Geotrans MGRS Converter Tests", ()=>{
    describe("A valid MGRS coordinate returns a valid point GeoJson object", () => {
        let validReturn = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-72.57553258519015, 42.367593344066776]
            },
            properties: {
                name: '18TXM9963493438'
            }
        };

        it("should return expected valid GeoJSON", ()=> {
            expect(converterInstance.convert("18TXM9963493438")).toEqual(validReturn);
        });
    });
    describe("A shorthand MGRS coordinate returns the same thing as a more precise counterpart", () => {
        it("should return expected valid GeoJSON", ()=> {
            let fineReturn = converterInstance.convert("18TXM10003000");
            let coarseReturn = converterInstance.convert("18TXM13");
            expect(fineReturn.geometry).toEqual(coarseReturn.geometry);
        });
    });
    describe("An invalid MGRS coordinate returns an error from Geotrans", () => {
        let invalidReturn = 'ERROR: Input Military Grid Reference System (MGRS): \nInvalid MGRS String\n';
        it("should return expected error from GeoTrans", ()=> {
            expect(converterInstance.convert("18SJT9710003009")).toEqual(invalidReturn);
        });
    });
    describe("An invalid MGRS coordinate returns an error from Geotrans", () => {
        let invalidReturn = 'ERROR: Invalid MGRS String';
        it("should return expected error from JS checker", ()=> {
            expect(converterInstance.convert("4CFG")).toEqual(invalidReturn);
        });
    });

});