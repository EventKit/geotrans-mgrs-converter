#!/bin/sh

LD_LIBRARY_PATH=$( cd "$( dirname "${$0}" )" && pwd )/geotrans3.7/CCS/linux_64
export LD_LIBRARY_PATH
#sudo dnf install -y libstdc++.i686
MSPCCS_DATA=$( cd "$( dirname "${$0}" )" && pwd )/geotrans3.7/data
export MSPCCS_DATA
