docker build -t mgrs-converter . && docker run -it -p 3150:3150 --entrypoint /bin/bash mgrs-converter
