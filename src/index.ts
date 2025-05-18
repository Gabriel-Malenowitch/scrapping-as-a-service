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
    
    let result;
    // if (querySelector) {
    //   // Faz o scrapping diretamente no contexto do navegador
    //   result = await page.$eval(querySelector, els => els.map(el => el.outerHTML));
    //   await browser.close();
    //   return res.json({ results: result });
    // } else {
      // Retorna o HTML completo
      const html = await page.content();
      await browser.close();
      return res.json({ html });
    // }

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

app.post('/face-get-ads-numbers', async (req, res) => {
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
    
    // Faz o scrapping diretamente no contexto do navegador
    const result = await page.evaluate(() => {
      const abc = Array.from(document.querySelectorAll('div,span,p,li,a,h1,h2,h3,h4,h5,h6'))
      const el = abc.find(e => /~\s*\d+\s*results?/i.test(String(e.textContent)));
      const match = /~\s*(\d+)\s*results?/i.exec(el?.textContent || '');
      
      console.log("abc", abc)
      console.log("el", el)
      console.log("match", match)

      return match ? match[1] : null;
    });
    await browser.close();
    return res.json({ results: result });

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