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
void convertGeocentricToEllipsoidHeight(
  MSP::CCS::CoordinateConversionService& ccsGeocentricToEllipsoidHeight,
  double x,
  double y,
  double z,
  double& lat,
  double& lon,
  double& height) {
  MSP::CCS::Accuracy sourceAccuracy;
  MSP::CCS::Accuracy targetAccuracy;
  MSP::CCS::CartesianCoordinates sourceCoordinates(
    MSP::CCS::CoordinateType::geocentric, x, y, z);
  MSP::CCS::GeodeticCoordinates targetCoordinates(
    MSP::CCS::CoordinateType::geodetic, lon, lat, height);

  ccsGeocentricToEllipsoidHeight.convertSourceToTarget( &sourceCoordinates, &sourceAccuracy,
    targetCoordinates,
    targetAccuracy);

  lat = targetCoordinates.latitude();
  lon = targetCoordinates.longitude();
  height = targetCoordinates.height();
}

/**
 * Function which uses the given Geodetic (Ellipsoid Height) to Geocentric 
 * Coordinate Conversion Service, 'ccsGeodeticEllipsoidToGeocentric', to
 * convert the given lat, lon, and height to x, y, z coordinates.
 **/
void convertGeodeticEllipsoidToGeocentric(
    MSP::CCS::CoordinateConversionService& ccsGeodeticEllipsoidToGeocentric,
    double lat,
    double lon,
    double height,
    double& x,
    double& y,
    double& z) {
    MSP::CCS::Accuracy sourceAccuracy;
    MSP::CCS::Accuracy targetAccuracy;
    MSP::CCS::GeodeticCoordinates sourceCoordinates(
      MSP::CCS::CoordinateType::geodetic, lon, lat, height);
    MSP::CCS::CartesianCoordinates targetCoordinates(
      MSP::CCS::CoordinateType::geocentric);

    ccsGeodeticEllipsoidToGeocentric.convertSourceToTarget( &sourceCoordinates, &sourceAccuracy,
      targetCoordinates,
      targetAccuracy);

    x = targetCoordinates.x();
    y = targetCoordinates.y();
    z = targetCoordinates.z();
  }
  /**
   * Function which uses the given Geocentric to MGRS Coordinate Conversion
   * Service, 'ccsGeocentricToMgrs', to convert the given x, y, z coordinates
   * to an MGRS string and precision.
   **/
std::string convertGeocentricToMgrs(
  MSP::CCS::CoordinateConversionService& ccsGeocentricToMgrs,
  double x,
  double y,
  double z,
  MSP::CCS::Precision::Enum& precision) {
  char* p;
  std::string mgrsString;

  MSP::CCS::Accuracy sourceAccuracy;
  MSP::CCS::Accuracy targetAccuracy;
  MSP::CCS::CartesianCoordinates sourceCoordinates(
    MSP::CCS::CoordinateType::geocentric, x, y, z);
  MSP::CCS::MGRSorUSNGCoordinates targetCoordinates;

  ccsGeocentricToMgrs.convertSourceToTarget( &sourceCoordinates, &sourceAccuracy,
    targetCoordinates,
    targetAccuracy);

  // Returned value, 'p', points to targetCoordinate's internal character
  // array so assign/copy the character array to mgrsString to avoid
  // introducing memory management issues
  p = targetCoordinates.MGRSString();
  mgrsString = p;

  return mgrsString;
}

/**
 * Function which uses the given Geocentric to MGRS Coordinate Conversion
 * Service, 'ccsGeocentricToMgrs', to convert the given x, y, z coordinates
 * to an MGRS string and precision.
 **/
MSP::CCS::CartesianCoordinates convertMgrsToGeocentric(
    MSP::CCS::CoordinateConversionService& ccsGeocentricToMgrs,
    const char* mgrsString) {
    MSP::CCS::Accuracy sourceAccuracy;
    MSP::CCS::Accuracy targetAccuracy;
    MSP::CCS::MGRSorUSNGCoordinates sourceCoordinates(
      MSP::CCS::CoordinateType::militaryGridReferenceSystem, mgrsString);
    MSP::CCS::CartesianCoordinates targetCoordinates(
      MSP::CCS::CoordinateType::geocentric);

    ccsGeocentricToMgrs.convertSourceToTarget( &sourceCoordinates, &sourceAccuracy,
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
std::string convertMgrsToGeodetic(std::string mgrsCoordinateInput, std::string datumInput) {
  double lat;
  double lon;
  double mslHeight;
  const char* datum = datumInput.c_str();
  const char* mgrsCoordinate = mgrsCoordinateInput.c_str();

  //Parameter setup
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
    datum, &mgrsParameters, datum, &geocentricParameters);

  MSP::CCS::CoordinateConversionService ccsGeocentricToEllipsoidHeight(
    datum, &geocentricParameters,
    datum, &ellipsoidParameters);

  
  try {
    MSP::CCS::CartesianCoordinates geocentricCoords = convertMgrsToGeocentric(ccsGeocentricToMgrs, mgrsCoordinate);

    convertGeocentricToEllipsoidHeight(
      ccsGeocentricToEllipsoidHeight,
      geocentricCoords.x(), geocentricCoords.y(), geocentricCoords.z(),
      lat, lon, mslHeight);
  } catch (MSP::CCS::CoordinateConversionException& ex) {
    std::string exceptionString(ex.getMessage());
    std::string outputString = "ERROR: " + exceptionString;
    return outputString;
  } catch (...) {
    std::string outputString = "ERROR: Unexpected exception encountered.";
    return outputString;
  }

  std::string outputString = std::to_string(lat) + ", " + std::to_string(lon);
  return outputString;
}

/**
 * Function to be wrapped with called by N-API function, taking in strings.
 **/
std::string convertGeodeticToMgrs(
  double lat, 
  double lon, 
  double mslHeight,
  std::string datumInput) {

  const char* datum = datumInput.c_str();
  std::string outputString;
  //
  // Coordinate System Parameters 
  //

  MSP::CCS::GeodeticParameters ellipsoidParameters(
    MSP::CCS::CoordinateType::geodetic,
    MSP::CCS::HeightType::ellipsoidHeight);

  MSP::CCS::CoordinateSystemParameters geocentricParameters(
    MSP::CCS::CoordinateType::geocentric);

  MSP::CCS::CoordinateSystemParameters mgrsParameters(
    MSP::CCS::CoordinateType::militaryGridReferenceSystem);

  MSP::CCS::CoordinateConversionService ccsGeodeticEllipsoidToGeocentric(
    datum, &ellipsoidParameters,
    datum, &geocentricParameters);

  MSP::CCS::CoordinateConversionService ccsGeocentricToMgrs(
    datum, &geocentricParameters,
    datum, &mgrsParameters);


  try {
    double x = 0.0; 
    double y = 0.0; 
    double z = 0.0;
    double height = 0.0;

    convertGeodeticEllipsoidToGeocentric(
      ccsGeodeticEllipsoidToGeocentric,
      lat, lon, height,
      x, y, z);

    MSP::CCS::Precision::Enum precision;

    std::string outputString = convertGeocentricToMgrs(
      ccsGeocentricToMgrs,
      x, y, z,
      precision);
    
  } catch (MSP::CCS::CoordinateConversionException& ex) {
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
void Init(Env env, Object exports, Object module) {
  exports.Set("callConvertToGeodetic", Function::New(env, callConvertToGeodetic));
  exports.Set("callConvertToMgrs", Function::New(env, callConvertToMgrs));
}
NODE_API_MODULE(addon, Init);
