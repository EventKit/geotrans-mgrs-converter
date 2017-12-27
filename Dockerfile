# base image
FROM ubuntu:latest
# expose port
EXPOSE 3150

# set work and home directory
ENV WORK=/opt/mgrs

# set workdir
WORKDIR ${WORK}
COPY . ${WORK}

# install necessary tools
RUN apt-get update && \
    apt-get install -y python npm wget curl

# install node 6.x
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs

# install node-gyp globally and install mgrs_converter dependencies
RUN npm install node-gyp -g && \
    npm install --unsafe-perm

# configure and build node-gyp
RUN node-gyp configure build


# start service
CMD [ "npm", "start" ]





