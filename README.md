# Puppeteer HTML Fetcher Server

Este servidor permite buscar o HTML de uma URL usando Puppeteer através de uma API REST.

## Requisitos

- Node.js
- Yarn

## Instalação

```bash
# Instalar dependências
yarn install
```

## Execução

```bash
# Compilar o TypeScript
yarn build

# Iniciar o servidor
yarn start
```

Ou para desenvolvimento:

```bash
# Executar em modo de desenvolvimento
yarn dev
```

## Uso

Envie uma requisição POST para `/fetch-html` com um corpo JSON contendo a URL:

```bash
curl -X POST http://localhost:3000/fetch-html \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}'
```

O servidor irá acessar a URL usando o Puppeteer e retornar o HTML resultante.