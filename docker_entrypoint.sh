#!/bin/bash

./wait-for-it.sh $DATABASE_HOST:${DATABASE_PORT:-27017}

npm run download-watchers \
  && npm run start

