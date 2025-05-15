FROM node:18-slim

# Instala o Chromium no sistema
RUN apt-get update && apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2t64 \
  libpangocairo-1.0-0 libxss1 libgtk-3-0 libxshmfence1 libglu1 chromium \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app/

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
