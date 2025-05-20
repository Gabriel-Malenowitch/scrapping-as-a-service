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
app.use(express_1.default.json());
let browser = null;
function getBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!browser) {
            console.log("Starting a new browser instance");
            browser = yield puppeteer_1.default.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            console.log("Browser started");
        }
        return browser;
    });
}
app.post('/fetch-html', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        console.log(`Fetching HTML from: ${url}`);
        const browserInstance = yield getBrowser();
        const page = yield browserInstance.newPage();
        console.log("Start new page");
        yield page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        console.log("Navigate to " + url);
        const html = yield page.content();
        console.log("HTML resulted");
        yield page.close();
        console.log('Close page');
        return res.json({ html });
    }
    catch (error) {
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
        console.log('Error fetching HTML: ' + errorMessage);
        res.status(500).json({ error: 'Failed to fetch HTML', details: errorMessage });
    }
}));
