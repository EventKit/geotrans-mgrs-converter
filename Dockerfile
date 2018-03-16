# base image
FROM ubuntu:xenial
# expose port
EXPOSE 3150

# set work directory
ENV WORK=/opt/mgrs

# set geotrans environment variables
ENV LD_LIBRARY_PATH=/opt/mgrs/geotrans3.7/CCS/linux_64
ENV MSPCCS_DATA=/opt/mgrs/geotrans3.7/data

# set workdir
WORKDIR ${WORK}
COPY . ${WORK}

# install necessary tools
RUN apt-get update && \
    apt-get install -y python npm wget curl vim

# install node 6.x
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs

# install node-gyp globally and install mgrs_converter dependencies. ignore "file already exists"
RUN npm install node-gyp -g && \
    npm install --unsafe-perm; exit 0;

# configure and build node-gyp
RUN node-gyp configure build

# start service
CMD [ "npm", "start" ]
