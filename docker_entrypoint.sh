#!/bin/bash

npm run download-watchers \
  && ./wait-for-it.sh $DATABASE_HOST:${DATABASE_PORT:-27017} \
  && npm run start

