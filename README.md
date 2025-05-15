# Scrapping as a Service

Este é um serviço de API que permite obter o HTML completo de qualquer URL utilizando Puppeteer para renderizar a página em um navegador headless. Ideal para web scraping, testes ou captura de conteúdo dinâmico gerado por JavaScript.

## Funcionalidades

- Renderização completa de páginas web, incluindo conteúdo gerado por JavaScript
- API REST simples para integração com outros serviços
- Suporte a todas as URLs acessíveis pela internet
- Retorno do HTML completo após o carregamento da página

## Requisitos

- Node.js (v14 ou superior)
- Yarn (v1.22 ou superior)
- Dependências do Puppeteer (Chrome/Chromium)

## Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
cd scrapping-as-a-service
```

2. Instale as dependências:

```bash
yarn install
```

## Execução

### Ambiente de Desenvolvimento

```bash
# Inicia o servidor em modo de desenvolvimento com hot-reload
yarn dev
```

### Ambiente de Produção

```bash
# Compila o TypeScript para JavaScript
yarn build

# Inicia o servidor a partir do código compilado
yarn start
```

Por padrão, o servidor será iniciado na porta 3000. Você pode alterar isso definindo a variável de ambiente `PORT`.

## Uso da API

### Endpoint: `/fetch-html`

**Método:** POST

**Corpo da requisição (JSON):**
```json
{
  "url": "https://www.example.com"
}
```

**Exemplo de requisição com curl:**

```bash
curl -X POST http://localhost:3000/fetch-html \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}'
```

**Exemplo de requisição com JavaScript (fetch):**

```javascript
fetch('http://localhost:3000/fetch-html', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://www.example.com'
  })
})
.then(response => response.text())
.then(html => console.log(html))
.catch(error => console.error('Error:', error));
```

**Resposta:**
O servidor retorna o HTML completo da página após ser renderizada pelo Puppeteer.

## Configurações Avançadas

O servidor utiliza as seguintes configurações do Puppeteer:

- **Modo Headless:** Ativado (`headless: 'new'`)
- **Tempo de espera:** 30 segundos para carregamento da página
- **Condição de conclusão:** `networkidle2` (quando não há mais de 2 conexões de rede por pelo menos 500ms)

## Tratamento de Erros

O servidor retorna os seguintes códigos de status HTTP:

- **400 Bad Request:** Quando a URL não é fornecida
- **500 Internal Server Error:** Quando ocorre um erro ao acessar a URL

## Segurança

Este serviço não implementa autenticação ou limitação de taxa. Em um ambiente de produção, considere adicionar:

- Autenticação por API key
- Rate limiting
- CORS configurado adequadamente
- Proxy reverso (como Nginx)

## Licença

MIT