const puppeteer = require('../node_modules/puppeteer-core');
const pptxgen = require('../node_modules/pptxgenjs');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIR = __dirname;
const HTML = 'Fashion RecSys Deck.dc.html';
const OUT_DIR = path.join(DIR, 'slides_png');
const OUT_PPTX = path.join(DIR, 'Fashion_RecSys_Deck.pptx');
const W = 1920, H = 1080;
const FONTS = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
// Same MathJax setup the deck uses, so $$...$$ formulas render in the export too.
const MATHJAX = `<script>window.MathJax={tex:{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']],processEscapes:true},options:{skipHtmlTags:['script','noscript','style','textarea','pre']}};</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" id="MathJax-script"></script>`;

const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml',
  '.gif':'image/gif', '.webp':'image/webp', '.json':'application/json' };

// Wait for MathJax to finish typesetting all $$...$$ on the page.
async function typesetMath(pg) {
  try {
    await pg.evaluate(async () => {
      if (window.MathJax && window.MathJax.startup) {
        await window.MathJax.startup.promise;
        if (window.MathJax.typesetPromise) await window.MathJax.typesetPromise();
      }
    });
  } catch (e) { /* no math on this slide */ }
}

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/' + HTML;
      const fp = path.join(DIR, p);
      if (!fp.startsWith(DIR) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.writeHead(404); return res.end('404');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(fp).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);
  const srv = await serve();
  const port = srv.address().port;
  const base = `http://127.0.0.1:${port}/`;
  const url = base + encodeURIComponent(HTML);
  console.log('serving', url);

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', `--window-size=${W},${H}`] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));

  // Pull the shared <style> block + each section's markup and speaker notes from the live DOM.
  const data = await page.evaluate(() => {
    const style = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
    const sections = [...document.querySelectorAll('section')].map(s => ({
      html: s.outerHTML,
      notes: s.getAttribute('data-speaker-notes') || ''
    }));
    return { style, sections };
  });
  console.log('sections:', data.sections.length);

  // Render each section standalone inside a fixed 1920x1080 frame.
  // Slides taller than 1080 (their natural content height) are scaled down
  // uniformly to fit — same "contain" behaviour as the deck-stage runtime —
  // with the frame background matching the slide so the letterbox is invisible.
  const files = [];
  const notes = [];
  const cap = await browser.newPage();
  await cap.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    const dark = /\bs-dark\b/.test(section.html.slice(0, 200));
    const bg = dark ? '#0D1B3E' : '#ffffff';

    // 1) Measure natural content height at width 1920 (height: auto).
    const measureHtml = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <base href="${base}"><link href="${FONTS}" rel="stylesheet">${MATHJAX}
      <style>${data.style}
        html,body{margin:0;padding:0;}
        #frame{width:${W}px;}
        #frame > section.s{width:${W}px;box-sizing:border-box;margin:0;}
      </style></head><body><div id="frame">${section.html}</div></body></html>`;
    await cap.setContent(measureHtml, { waitUntil: 'load', timeout: 60000 });
    await cap.evaluate(() => document.fonts.ready);
    await typesetMath(cap);
    await new Promise(r => setTimeout(r, 400));
    const natH = await cap.evaluate(() =>
      document.querySelector('#frame > section').getBoundingClientRect().height);

    // 2) Render: fit 1080 height; shrink (never enlarge) if it overflows.
    const scale = Math.min(1, H / natH);
    const secStyle = scale < 1
      ? `width:${W}px;height:auto;box-sizing:border-box;margin:0;transform-origin:top center;transform:scale(${scale});`
      : `width:${W}px;height:${H}px;box-sizing:border-box;margin:0;`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <base href="${base}"><link href="${FONTS}" rel="stylesheet">${MATHJAX}
      <style>${data.style}
        html,body{margin:0;padding:0;background:${bg};}
        #frame{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:${bg};
          display:flex;justify-content:center;align-items:flex-start;}
        #frame > section.s{${secStyle}}
      </style></head><body><div id="frame">${section.html}</div></body></html>`;
    await cap.setContent(html, { waitUntil: 'load', timeout: 60000 });
    await cap.evaluate(() => document.fonts.ready);
    await typesetMath(cap);
    await new Promise(r => setTimeout(r, 700));
    const f = path.join(OUT_DIR, `slide_${String(i + 1).padStart(2, '0')}.png`);
    const el = await cap.$('#frame');
    await el.screenshot({ path: f });
    files.push(f);
    notes.push(section.notes);
    if (scale < 1) console.log(`  slide ${i + 1}: scaled ${scale.toFixed(3)} (natH ${Math.round(natH)})`);
  }
  await browser.close();
  srv.close();
  console.log('captured', files.length, 'slides');

  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'HD', width: 13.333, height: 7.5 });
  pptx.layout = 'HD';

  // Parse speaker notes from Markdown file if it exists
  const notesFilePath = path.join(DIR, 'Fashion RecSys Speaker Notes_v2.md');
  let mdNotes = [];
  if (fs.existsSync(notesFilePath)) {
    try {
      const mdContent = fs.readFileSync(notesFilePath, 'utf8');
      const parts = mdContent.split(/\r?\n##\s+/);
      for (let i = 1; i < parts.length; i++) {
        const lines = parts[i].split(/\r?\n/);
        const bulletPoints = [];
        for (let line of lines) {
          if (line.trim().startsWith('>')) {
            const idx = line.indexOf('>');
            let content = line.substring(idx + 1);
            content = content.replace(/\*\*/g, ''); // Remove bold markers
            content = content.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links
            if (content.trim() === '') continue;
            bulletPoints.push(content);
          }
        }
        mdNotes.push(bulletPoints.join('\n'));
      }
      console.log('Parsed speaker notes from MD file:', mdNotes.length);
    } catch (err) {
      console.error('Error parsing MD notes:', err);
    }
  }

  for (let i = 0; i < files.length; i++) {
    const slide = pptx.addSlide();
    slide.addImage({ path: files[i], x: 0, y: 0, w: 13.333, h: 7.5 });
    
    // Use parsed notes from MD file, fallback to HTML data-speaker-notes
    const slideNotes = mdNotes[i] || notes[i] || '';
    if (slideNotes) {
      slide.addNotes(slideNotes);
    }
  }
  await pptx.writeFile({ fileName: OUT_PPTX });
  console.log('wrote', OUT_PPTX);
})().catch(e => { console.error(e); process.exit(1); });



