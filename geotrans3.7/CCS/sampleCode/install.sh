#!/bin/bash
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(cd ../ && pwd)/linux_64
export LD_LIBRARY_PATH
sudo dnf install -y libstdc++.i686