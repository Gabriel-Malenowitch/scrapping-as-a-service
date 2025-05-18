# Usa imagem leve com suporte a Chromium
FROM node:18-slim

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium


# Instala dependências necessárias do sistema para Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    && apt-get clean

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Diretório de trabalho
WORKDIR /app

# Copia arquivos
COPY . .

# Evita download do Chromium pelo Puppeteer (usaremos o do sistema)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Instala dependências
RUN yarn install && yarn build

# Expõe a porta 3000
EXPOSE 5500
ENV PORT=5500

# Comando para rodar o servidor
CMD ["node", "dist/index.js"]
