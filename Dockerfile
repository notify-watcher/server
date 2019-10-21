# syntax=docker/dockerfile:1.0-experimental

FROM node:12.12

ENV NODE_ENV=production

WORKDIR /server

RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh

# REQUIRED FOR Puppeteer - init
# from https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile

RUN apt-get update && apt-get -yq upgrade && apt-get install \
  && apt-get autoremove && apt-get autoclean

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
# https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-unstable
RUN apt-get update && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb

# Add pptr user.
RUN groupadd -r user && useradd -r -g user -G audio,video user \
  && mkdir -p /home/user/Downloads \
  && chown -R user:user /home/user 

# REQUIRED FOR Puppeteer - end

COPY package.json .
COPY package-lock.json .

RUN --mount=type=secret,id=npmrc,dst=/server/.npmrc npm install

COPY lib lib
COPY src src

RUN npm run download-watchers

RUN chown -R user:user /server

RUN echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/userns.conf
USER user

CMD ["npm", "run", "start"]
