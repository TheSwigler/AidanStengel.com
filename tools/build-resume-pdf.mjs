// Prints /resume/ to /resume.pdf using the page's own print styles.
// Run from the repo root: node tools/build-resume-pdf.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const port = 8799;
const server = spawn('python3', ['-m', 'http.server', String(port)], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1200));
try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/resume/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: 'resume.pdf', format: 'Letter', printBackground: false });
  await browser.close();
  console.log('Wrote resume.pdf');
} finally {
  server.kill();
}
