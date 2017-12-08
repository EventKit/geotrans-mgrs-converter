#!/bin/bash

export LD_LIBRARY_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/geotrans3.7/CCS/linux_64
#sudo dnf install -y libstdc++.i686
export MSPCCS_DATA=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/geotrans3.7/data
