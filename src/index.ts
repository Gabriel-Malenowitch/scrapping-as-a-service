import axios from 'axios';
import express from 'express';
import puppeteer, { Browser } from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
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

app.post('/fetch-html', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Fetching HTML from: ${url}`);

    const browserInstance = await getBrowser();

    const page = await browserInstance.newPage();
    console.log("Start new page");

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
