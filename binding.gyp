{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        "geotrans3.7/CCS/sampleCode/mgrsToGeodetic.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "geotrans3.7/CCS/src/CoordinateConversion",
        "geotrans3.7/CCS/src/dtcc",
        "geotrans3.7/CCS/src/dtcc/Enumerations",
        "geotrans3.7/CCS/src/dtcc/CoordinateSystemParameters",
        "geotrans3.7/CCS/src/dtcc/CoordinateSystems",
        "geotrans3.7/CCS/src/dtcc/CoordinateTuples",
        "geotrans3.7/CCS/src/dtcc/Exception"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
          "-lMSPdtcc",
          "-lMSPCoordinateConversionService"
      ],
      "ldflags": [
          "-L<(module_root_dir)/geotrans3.7/CCS/linux_64"
      ],
      "cflags": ["-fexceptions"],
      "cflags_cc": ["-fexceptions", "-Wno-deprecated"],
      "defines": ["NAPI_CPP_EXCEPTIONS"]
      ]
    }
  ]
}
