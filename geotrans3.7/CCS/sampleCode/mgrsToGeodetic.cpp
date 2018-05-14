
#include <napi.h>
#include <ctime>
#include <cerrno>
#include <iostream>
#include <string>
#include <math.h>
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


std::string convertMgrsToGeodetic(std::string mgrs, std::string datumInput) {

  const char * datum = datumInput.c_str();
  const char * mgrsCoordinateInput = mgrs.c_str();

  MSP::CCS::GeodeticParameters geodeticParameters(
    MSP::CCS::CoordinateType::geodetic,
    MSP::CCS::HeightType::ellipsoidHeight);

  MSP::CCS::GeodeticParameters ellipsoidParameters(
    MSP::CCS::CoordinateType::geodetic,
    MSP::CCS::HeightType::ellipsoidHeight);

  MSP::CCS::CoordinateSystemParameters mgrsParameters(
    MSP::CCS::CoordinateType::militaryGridReferenceSystem);

  MSP::CCS::CoordinateSystemParameters geocentricParameters(
    MSP::CCS::CoordinateType::geocentric);

  MSP::CCS::CoordinateConversionService ccsGeocentricToMgrs(
    datum, & mgrsParameters, datum, & geocentricParameters);

  MSP::CCS::CoordinateConversionService ccsGeocentricToEllipsoidHeight(
    datum, & geocentricParameters,
    datum, & ellipsoidParameters);

  MSP::CCS::Accuracy mgrsAccuracy;
  MSP::CCS::Accuracy geocentricAccuracy;
  MSP::CCS::Accuracy geodeticAccuracy;
  MSP::CCS::GeodeticCoordinates geodeticCoordinates(
    MSP::CCS::CoordinateType::geodetic);
  try {
    MSP::CCS::MGRSorUSNGCoordinates mgrsCoordinate(
      MSP::CCS::CoordinateType::militaryGridReferenceSystem, mgrsCoordinateInput);
    MSP::CCS::CartesianCoordinates geocentricCoordinates(
      MSP::CCS::CoordinateType::geocentric);
    

    ccsGeocentricToMgrs.convertSourceToTarget( & mgrsCoordinate, & mgrsAccuracy,
      geocentricCoordinates,
      geocentricAccuracy);

    ccsGeocentricToEllipsoidHeight.convertSourceToTarget( & geocentricCoordinates, & geocentricAccuracy,
      geodeticCoordinates,
      geodeticAccuracy);

  } catch (MSP::CCS::CoordinateConversionException & ex) {
    std::string exceptionString(ex.getMessage());
    std::string outputString = "ERROR: " + exceptionString;
    return outputString;
  } catch (...) {
    std::string outputString = "ERROR: Unexpected exception encountered.";
    return outputString;
  }

  std::string outputString = std::to_string(geodeticCoordinates.latitude()) + ", " + std::to_string(geodeticCoordinates.longitude());
  return outputString;
}

/**
 * Function to be wrapped with called by N-API function, taking in strings.
 **/
std::string convertGeodeticToMgrs(double lat, double lon, double mslHeight, std::string datumInput) {
  const char * datum = datumInput.c_str();

  MSP::CCS::GeodeticParameters ellipsoidParameters(
    MSP::CCS::CoordinateType::geodetic,
    MSP::CCS::HeightType::ellipsoidHeight);

  MSP::CCS::CoordinateSystemParameters geocentricParameters(
    MSP::CCS::CoordinateType::geocentric);

  MSP::CCS::CoordinateSystemParameters mgrsParameters(
    MSP::CCS::CoordinateType::militaryGridReferenceSystem);

  MSP::CCS::CoordinateConversionService ccsGeodeticEllipsoidToGeocentric(
    datum, & ellipsoidParameters,
    datum, & geocentricParameters);

  MSP::CCS::CoordinateConversionService ccsGeocentricToMgrs(
    datum, & geocentricParameters,
    datum, & mgrsParameters);

  MSP::CCS::Accuracy mgrsAccuracy;
  MSP::CCS::Accuracy geocentricAccuracy;
  MSP::CCS::Accuracy geodeticAccuracy;

  std::string outputString;
  char * p;

  try {

    MSP::CCS::GeodeticCoordinates geodeticCoordinates(MSP::CCS::CoordinateType::geodetic, lon, lat, mslHeight);
    MSP::CCS::CartesianCoordinates geocentricCoordinates(MSP::CCS::CoordinateType::geocentric);
    MSP::CCS::MGRSorUSNGCoordinates mgrsCoordinate;

    ccsGeodeticEllipsoidToGeocentric.convertSourceToTarget( & geodeticCoordinates, & geodeticAccuracy,
      geocentricCoordinates,
      geocentricAccuracy);

    ccsGeocentricToMgrs.convertSourceToTarget( & geocentricCoordinates, & geocentricAccuracy,
      mgrsCoordinate,
      mgrsAccuracy);

    p = mgrsCoordinate.MGRSString();
    outputString = p;

  } catch (MSP::CCS::CoordinateConversionException & ex) {
    std::string exceptionString(ex.getMessage());
    std::string outputString = "ERROR: " + exceptionString;
    return outputString;
  } catch (...) {
    std::string outputString = "ERROR: Unexpected exception encountered.";
    return outputString;
  }
  return outputString;

}


/**
 * Function to be called by N-API function. Arguments passed from init function.
 **/
String callConvertToGeodetic(const CallbackInfo& info) {
  return String::New(info.Env(), convertMgrsToGeodetic(info[0].As<String>().Utf8Value(), info[1].As<String>().Utf8Value()));
}

/**
 * Function to be called by N-API function. Arguments passed from init function.
 **/
String callConvertToMgrs(const CallbackInfo& info) {
  return String::New(info.Env(), convertGeodeticToMgrs(info[0].As<Number>(), info[1].As<Number>(), info[2].As<Number>(), info[3].As<String>().Utf8Value()));
}

/**
 * Initializer
 **/
Object Init(Env env, Object exports)
{
    exports.Set(String::New(env, "callConvertToGeodetic"), Function::New(env, callConvertToGeodetic));
    exports.Set(String::New(env, "callConvertToMgrs"), Function::New(env, callConvertToMgrs));
    return exports;

}
NODE_API_MODULE(addon, Init);
