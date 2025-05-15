"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware para processar JSON
app.use(express_1.default.json());
// Endpoint POST para receber uma URL e retornar o HTML
app.post('/fetch-html', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        console.log(`Fetching HTML from: ${url}`);
        // Inicializar o navegador Puppeteer
        const browser = yield puppeteer_1.default.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        // Criar uma nova página
        const page = yield browser.newPage();
        // Navegar para a URL fornecida
        yield page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        // Obter o conteúdo HTML da página
        const html = yield page.content();
        // Fechar o navegador
        yield browser.close();
        // Retornar o HTML como resposta
        res.send(html);
    }
    catch (error) {
        console.error('Error fetching HTML:', error);
        // Tratamento seguro do erro
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = String(error.message);
        }
        res.status(500).json({ error: 'Failed to fetch HTML', details: errorMessage });
    }
}));
// Rota básica para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Puppeteer HTML Fetcher API is running. Send a POST request to /fetch-html with a URL in the request body.');
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
