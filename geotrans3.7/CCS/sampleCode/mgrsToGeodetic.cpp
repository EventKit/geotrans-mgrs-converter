#include <napi.h>
#include <ctime>
#include <cerrno>
#include <iostream>
#include <string>

#include "CoordinateConversionService.h"
#include "CoordinateSystemParameters.h"
#include "GeodeticParameters.h"
#include "CoordinateTuple.h"
#include "GeodeticCoordinates.h"
#include "CartesianCoordinates.h"
#include "Accuracy.h"
#include "MGRSorUSNGCoordinates.h"
#include "UTMParameters.h"
#include "UTMCoordinates.h"
#include "CoordinateType.h"
#include "HeightType.h"
#include "CoordinateConversionException.h"

using namespace Napi;

/**
 * Function which uses the given Geocentric to Geodetic (MSL EGM 96 15M)
 * Coordinate Conversion Service, 'ccsGeocentricToGeodeticMslEgm96', to
 * convert the given x, y, z coordinates to a lat, lon, and height.
 **/
void convertGeocentricToGeodeticMslEgm96(
    MSP::CCS::CoordinateConversionService& ccsGeocentricToGeodeticMslEgm96,
    double x,
    double y,
    double z,
    double& lat,
    double& lon,
    double& height)
{
    MSP::CCS::Accuracy sourceAccuracy;
    MSP::CCS::Accuracy targetAccuracy;
    MSP::CCS::CartesianCoordinates sourceCoordinates(
        MSP::CCS::CoordinateType::geocentric, x, y, z);
    MSP::CCS::GeodeticCoordinates targetCoordinates(
        MSP::CCS::CoordinateType::geodetic, lon, lat, height);

    ccsGeocentricToGeodeticMslEgm96.convertSourceToTarget(
        &sourceCoordinates,
        &sourceAccuracy,
        targetCoordinates,
        targetAccuracy);

    lat = targetCoordinates.latitude();
    lon = targetCoordinates.longitude();
    height = targetCoordinates.height();
}

/**
 * Function which uses the given Geocentric to MGRS Coordinate Conversion
 * Service, 'ccsGeocentricToMgrs', to convert the given x, y, z coordinates
 * to an MGRS string and precision.
 **/
MSP::CCS::CartesianCoordinates convertGeocentricToMgrs(
    MSP::CCS::CoordinateConversionService& ccsGeocentricToMgrs,
    const char* mgrsString)
{
    MSP::CCS::Accuracy sourceAccuracy;
    MSP::CCS::Accuracy targetAccuracy;
    MSP::CCS::MGRSorUSNGCoordinates sourceCoordinates(
        MSP::CCS::CoordinateType::militaryGridReferenceSystem, mgrsString);
    MSP::CCS::CartesianCoordinates targetCoordinates(
        MSP::CCS::CoordinateType::geocentric);

    ccsGeocentricToMgrs.convertSourceToTarget(
        &sourceCoordinates,
        &sourceAccuracy,
        targetCoordinates,
        targetAccuracy);
    // Returned value, 'p', points to targetCoordinate's internal character
    // array so assign/copy the character array to mgrsString to avoid
    // introducing memory management issues
    return targetCoordinates;
}

/**
 * Function to be wrapped with called by N-API function, taking in strings.
 **/
std::string convertMgrsToGeodetic(std::string mgrsCoordinateInput, std::string datumInput)
{
    double lat;
    double lon;
    const char* datum = datumInput.c_str();
    const char* mgrsCoordinate = mgrsCoordinateInput.c_str();

    //Parameter setup
    MSP::CCS::GeodeticParameters mslEgm96Parameters(
        MSP::CCS::CoordinateType::geodetic,
        MSP::CCS::HeightType::EGM96FifteenMinBilinear);

    MSP::CCS::CoordinateSystemParameters mgrsParameters(
        MSP::CCS::CoordinateType::militaryGridReferenceSystem);

    MSP::CCS::CoordinateSystemParameters geocentricParameters(
        MSP::CCS::CoordinateType::geocentric);

    MSP::CCS::CoordinateConversionService ccsGeocentricToMgrs(
        datum, &mgrsParameters, datum, &geocentricParameters);

    MSP::CCS::CoordinateConversionService ccsGeocentricToGeodeticMslEgm96(
        datum, &geocentricParameters,
        datum, &mslEgm96Parameters);

    try {
        MSP::CCS::CartesianCoordinates geocentricCoords = convertGeocentricToMgrs(ccsGeocentricToMgrs, mgrsCoordinate);
        double mslHeight;

        convertGeocentricToGeodeticMslEgm96(
            ccsGeocentricToGeodeticMslEgm96,
            geocentricCoords.x(), geocentricCoords.y(), geocentricCoords.z(),
            lat, lon, mslHeight);
    }
    catch (std::exception& e) {
        std::cerr << "ERROR: Unexpected exception encountered - "
                  << e.what() << std::endl;
    }

    std::string outputString = std::to_string(lat) + ", " + std::to_string(lon);
    return outputString;
}

/**
 * Function to be called by N-API function. Arguments passed from init function.
 **/
String callConvertToGeodetic(const CallbackInfo& info)
{
    return String::New(info.Env(), convertMgrsToGeodetic(info[0].As<String>().Utf8Value(), info[1].As<String>().Utf8Value()));
}

/**
 * Initializer
 **/
void Init(Env env, Object exports, Object module)
{
    exports.Set("callConvertToGeodetic", Function::New(env, callConvertToGeodetic));
}
NODE_API_MODULE(addon, Init);