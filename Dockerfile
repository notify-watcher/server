# syntax=docker/dockerfile:1.0-experimental

FROM node:12.12

ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /server

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer installs, work.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh

COPY docker_entrypoint.sh .
RUN chmod +x docker_entrypoint.sh

COPY package.json .
COPY package-lock.json .

RUN --mount=type=secret,id=npmrc,dst=/server/.npmrc npm install

COPY lib lib
COPY src src

ENTRYPOINT ["./docker_entrypoint.sh"]
