#!/bin/bash
if [ -e master.tgz ]
then
    tar -xzkf master.tgz || :
else
    wget 'http://earth-info.nga.mil/GandG/geotrans/geotrans3.7/master.tgz'; tar -xzkf master.tgz || :

fi
