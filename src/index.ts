import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Endpoint POST para receber uma URL e retornar o HTML
app.post('/fetch-html', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`Fetching HTML from: ${url}`);
    
    // Inicializar o navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Criar uma nova página
    const page = await browser.newPage();
    
    // Navegar para a URL fornecida
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Obter o conteúdo HTML da página
    const html = await page.content();
    
    // Fechar o navegador
    await browser.close();
    
    // Retornar o HTML como resposta
    res.send(html);
  } catch (error: unknown) {
    console.error('Error fetching HTML:', error);
    
    // Tratamento seguro do erro
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    res.status(500).json({ error: 'Failed to fetch HTML', details: errorMessage });
  }
});

// Rota básica para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Puppeteer HTML Fetcher API is running. Send a POST request to /fetch-html with a URL in the request body.');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});