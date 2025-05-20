import axios from 'axios';
import express from 'express';
import puppeteer, { Browser } from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

const log = (message: string) => {
  // 970315961
  // 7770155542:AAFzy1s4maCcQpB9Qn97InAnSiRa1rBlY_s


  const TOKEN = '7770155542:AAFzy1s4maCcQpB9Qn97InAnSiRa1rBlY_s';
  const CHAT_ID = 970315961

  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: message
  }) //.then(e=>console.log(e)).catch(e=>console.log("eerr", e))
}

// Middleware para processar JSON
app.use(express.json());

// Variável para armazenar a instância do navegador
let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    console.log("Starting a new browser instance");
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log("Browser started");
  }
  return browser;
}

// Endpoint POST para receber uma URL e retornar o HTML
// Endpoint POST para receber uma URL e retornar o HTML
app.post('/fetch-html', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Fetching HTML from: ${url}`);

    // Obter a instância do navegador (cria nova se não existir)
    const browserInstance = await getBrowser();

    // Criar uma nova página
    const page = await browserInstance.newPage();
    console.log("Start new page");

    // Navegar para a URL fornecida
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log("Navigate to " + url);

    const html = await page.content();
    console.log("HTML resulted");

    await page.close();
    console.log('Close page');

    return res.json({ html });

  } catch (error: unknown) {
    // Tratamento seguro do erro
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    console.log('Error fetching HTML: ' + errorMessage);
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

      return match ? match[1] : null;
    });
    await browser.close();
    return res.json({ results: result });

  } catch (error: unknown) {
    // Tratamento seguro do erro
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    console.log('Error fetching HTML: ' + errorMessage);
    
    res.status(500).json({ error: 'Failed to fetch HTML', details: errorMessage });
  }
});

// Novo endpoint para processar várias URLs com delay de 10 segundos entre cada
app.post('/face-get-ads-numbers-batch', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'urls must be a non-empty array' });
    }

    const results: string[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`Fetching HTML from: ${url}`);
      try {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        const result = await page.evaluate(() => {
          const abc = Array.from(document.querySelectorAll('div,span,p,li,a,h1,h2,h3,h4,h5,h6'));
          const el = abc.find(e => /~\s*\d+\s*results?/i.test(String(e.textContent)));
          const match = /~\s*(\d+)\s*results?/i.exec(el?.textContent || '');
          return match ? match[1] : null;
        });
        await browser.close();
        results.push(result || '');
      } catch (err) {
        results.push(''); // Se falhar, adiciona string vazia
      }
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos
      }
    }
    return res.json({ results });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    console.log('Error in batch endpoint: ' + errorMessage);
    res.status(500).json({ error: 'Failed to fetch batch results', details: errorMessage });
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