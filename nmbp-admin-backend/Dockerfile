FROM ghcr.io/techknowkraftai/node

WORKDIR /usr/src/app

COPY package.json . 

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 \
       libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
       libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
       libxcomposite1 libxcursor1 libxdamage1 libxext6 libxi6 libxrandr2 libxrender1 libxss1 \
       libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
       wget libxft-dev libfreetype6 libdrm2 libgbm1 libxshmfence1 libnss3-dev \
       libx11-dev libxt-dev libgdk-pixbuf2.0-dev libglib2.0-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Noto_Serif_Kannada.zip /tmp/

RUN mkdir -p /usr/share/fonts/truetype/noto && \
    unzip -q /tmp/Noto_Serif_Kannada.zip -d /usr/share/fonts/truetype/noto && \
    rm /tmp/Noto_Serif_Kannada.zip && \
    fc-cache -f -v

RUN npm install

COPY . .

EXPOSE 7003

CMD [ "npm", "start" ]
