import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { serve } from './serve.mjs';

const CANDIDATES = [process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);

export async function open(port = 5179) {
  const exe = CANDIDATES.find(existsSync);
  if (!exe) throw new Error('Chrome not found; set CHROME_PATH');
  const server = await serve(port);
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--force-color-profile=srgb'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto('http://localhost:' + port + '/index.html?export=1');
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  const grab = async (t) => {
    const b64 = await page.evaluate((tt) => { window.renderAt(tt); return document.querySelector('canvas').toDataURL('image/png').split(',')[1]; }, t);
    return Buffer.from(b64, 'base64');
  };
  const close = async () => { await browser.close(); server.close(); };
  return { grab, close, page };
}
