#!/bin/bash
if [ -e master.tgz ]
then
    tar -xzkf master.tgz || :
else
    wget 'https://earth-info.nga.mil/GandG/geotrans/geotrans3.7/master.tgz' --no-check-certificate; tar -xzkf master.tgz || :

fi
