#!/bin/bash

docker build -t mgrs-converter . && docker run -it --entrypoint /bin/sh mgrs-converter
