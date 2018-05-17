
const jasmine = require('jasmine'),
    sanitize = require('./utils').sanitize,
    serverConvert = require('./server').convert;

describe("Utilities tests", ()=> {
    describe("Sanitizer tests", () => {
        describe("Sanitizer tests", () => {
            let errorReceived;
            const res = {
                status: (code) => {
                    return {
                        send: (msg) => {
                            errorReceived = msg;
                        }
                    }
                }
            };
            let req = { 'query': {}};
            it('should fail if datum not given', () => {
                req.query = {
                        'from':'decdeg',
                        'to':'mgrs'
                    };
                sanitize(req,res,null);
                expect(errorReceived.errors).toBe('invalid or missing parameter: datum');
            });
            it('should fail if to not given', () => {
                req.query = {
                    'from':'decdeg',
                    'datum':'WGE'
                };
                sanitize(req,res,null);
                expect(errorReceived.errors).toBe('invalid or missing parameter: to');
            });
            it('should fail if q not given', () => {
                req.query = {
                        'from':'mgrs',
                        'datum':'WGE',
                        'to':'decdeg'
                    };
                sanitize(req,res,null);
                expect(errorReceived.errors).toBe('invalid or missing parameter: q');
            });
            it('should fail if lat not given', () => {
                req.query = {
                    'from':'decdeg',
                    'datum':'WGE',
                    'to':'mgrs',
                    'lon': -77
                };
                sanitize(req,res,null);
                expect(errorReceived.errors).toBe('invalid or missing parameter: lat');
            });
            it('should fail if coordinate type not mgrs or decdeg', () => {
                req.query = {
                    'from':'mgrs',
                    'datum':'WGE',
                    'to':'utm',
                    'lat':39,
                    'lon':-79
                };
                serverConvert(req,res);
                expect(errorReceived.errors).toBe('coordinate type not supported');
            });
        });
    });
});