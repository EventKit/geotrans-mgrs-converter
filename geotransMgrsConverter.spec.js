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
                coordinates: [-72.57553, 42.36759]
            },
            properties: {
                name: '18TXM9963493438'
            }
        };

        it("should return expected valid GeoJSON", ()=> {
            expect(converterInstance.mgrsToDecDeg("18TXM9963493438")).toEqual(validReturn);
        });
    });
    describe("A shorthand MGRS coordinate returns the same thing as a more precise counterpart", () => {
        it("should return expected valid GeoJSON", ()=> {
            let fineReturn = converterInstance.mgrsToDecDeg("18TXM10003000");
            let coarseReturn = converterInstance.mgrsToDecDeg("18TXM13");
            expect(fineReturn.geometry).toEqual(coarseReturn.geometry);
        });
    });
    describe("An invalid MGRS coordinate returns an error from Geotrans", () => {
        let invalidReturn = 'ERROR: Input Military Grid Reference System (MGRS): \nInvalid MGRS String\n';
        it("should return expected error from GeoTrans", ()=> {
            expect(converterInstance.mgrsToDecDeg("18SJT9710003009")).toEqual(invalidReturn);
        });
    });
    describe("An invalid MGRS coordinate returns an error from Geotrans", () => {
        let invalidReturn = 'ERROR: Invalid MGRS String';
        it("should return expected error from JS checker", ()=> {
            expect(converterInstance.mgrsToDecDeg("4CFG")).toEqual(invalidReturn);
        });
    });

    describe("A valid decimal degree coordinate returns a valid point Geojson object and MGRS string", () => {
        let validReturn = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-72.57553, 42.36759]
            },
            properties: {
                name: '18TXM9963493437'
            }
        };

        it("should return expected valid GeoJSON", ()=> {
            expect(converterInstance.decDegToMgrs(42.367593344066776, -72.57553258519015)).toEqual(validReturn);
        });
    });
    describe("An invalid decimal degree coordinate returns an error from Geotrans", () => {
        let invalidReturn = 'ERROR: Invalid Coordinate';
        it("should return expected error from JS", ()=> {
            expect(converterInstance.decDegToMgrs(-181, -72)).toEqual(invalidReturn);
        });
    });
    

});