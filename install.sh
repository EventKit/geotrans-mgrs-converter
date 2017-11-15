#!/bin/bash

LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd)/geotrans3.7/CCS/linux_64
export LD_LIBRARY_PATH
# sudo dnf install -y libstdc++.i686
export MSPCCS_DATA=$(pwd)/geotrans3.7/data
