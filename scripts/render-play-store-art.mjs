// Typeset store artwork and preview sheets in HTML without changing app UI.
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../store/', import.meta.url));
const image = async p => 'data:image/png;base64,' + (await readFile(path.join(output, p))).toString('base64');
const art = await image('source/hero-illustration.png');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  for (const [lang, lines, supporting] of [
    ['en-US', ['From zero.', 'At your own pace.'], 'Gentle exercise at home'],
    ['ro-RO', ['De la zero.', 'În ritmul tău.'], 'Exerciții blânde, acasă']
  ]) {
    for (const [filename, width, height] of [['feature-graphic.png', 1024, 500], ['hero-1920x1080.png', 1920, 1080]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const scale = width / 1024;
      const hero = height === 1080;
      const html = `<html lang="${lang}"><head><meta charset="utf-8"><style>
        *{box-sizing:border-box;margin:0}body{width:${width}px;height:${height}px;overflow:hidden;background:#f5efe3;font-family:'DejaVu Sans',Arial,sans-serif;color:#314b3b}
        .art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .copy{position:absolute;left:${72*scale}px;top:${(hero?121:89)*scale}px;width:${474*scale}px}
        .brand{font-size:${31*scale}px;font-weight:700;letter-spacing:${-1*scale}px;color:#4e6a57;margin-bottom:${27*scale}px}
        h1{font-size:${lang==='en-US'?45*scale:47*scale}px;font-weight:700;line-height:1.15;letter-spacing:${-1.7*scale}px}
        p{margin-top:${27*scale}px;font-size:${19*scale}px;line-height:1.35;color:#6b5544}
      </style></head><body><img class="art" src="${art}"><div class="copy"><div class="brand">Mișcare</div><h1>${lines.join('<br>')}</h1><p>${supporting}</p></div></body></html>`;
      await page.setContent(html);
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img=>img.decode())); });
      await page.screenshot({ path: path.join(output, lang, filename), omitBackground: false });
      if (filename==='feature-graphic.png') await writeFile(path.join(output, 'source', `feature-${lang}.html`),html);
      await page.close();
    }
    const files = ['01-today.png','02-guided-session.png','03-exercise-library.png','04-equipment.png','05-journal.png','06-your-data.png'];
    const labels = lang==='en-US' ? ['Daily routine','Guided session','Exercise library','Equipment','Workout journal','Local data'] : ['Sesiunea de azi','Ghidaj pas cu pas','Catalogul de exerciții','Echipament','Jurnal','Date locale'];
    const cards = [];
    for (let i=0;i<files.length;i++) cards.push(`<figure><img src="${await image(`${lang}/phone-screenshots/${files[i]}`)}"><figcaption>${String(i+1).padStart(2,'0')} / ${labels[i]}</figcaption></figure>`);
    const page = await browser.newPage({ viewport: { width: 1200, height: 1720 }, deviceScaleFactor: 1 });
    await page.setContent(`<html><head><style>*{box-sizing:border-box;margin:0}body{padding:40px;background:#ede9df;color:#314b3b;font-family:'DejaVu Sans',Arial,sans-serif}h1{font-size:32px;margin-bottom:12px}p{font-size:16px;margin-bottom:30px}.graphic{width:700px;height:auto;display:block;margin:0 auto 28px;box-shadow:0 4px 18px #314b3b22}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}figure{background:#fff;padding:10px;border-radius:12px}figure img{display:block;width:100%;height:auto}figcaption{padding:12px 3px;font-size:15px}</style></head><body><h1>Mișcare — ${lang}</h1><p>Play Store assets · 1080 × 1920 app captures · synthetic sample data</p><img class="graphic" src="${await image(`${lang}/feature-graphic.png`)}"><div class="grid">${cards.join('')}</div></body></html>`);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
    await page.screenshot({ path: path.join(output, 'previews', `${lang}-overview.png`), fullPage: true });
    await page.close();
    for (const profile of ['tablet-7', 'tablet-10']) {
      const cards = [];
      for (let i = 0; i < files.length; i++) {
        cards.push(`<figure><img src="${await image(`${lang}/${profile}-screenshots/${files[i]}`)}"><figcaption>${String(i+1).padStart(2,'0')} / ${labels[i]}</figcaption></figure>`);
      }
      const preview = await browser.newPage({ viewport: { width: 1600, height: 820 }, deviceScaleFactor: 1 });
      await preview.setContent(`<html lang="${lang}"><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0}body{padding:32px;background:#ede9df;color:#314b3b;font-family:'DejaVu Sans',Arial,sans-serif}h1{font-size:28px;margin-bottom:8px}p{font-size:16px;margin-bottom:24px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{background:#fff;padding:8px;border-radius:10px}figure img{display:block;width:100%;height:auto}figcaption{padding:10px 3px;font-size:15px}</style></head><body><h1>Mișcare — ${lang} — ${profile}</h1><p>App captures at tablet viewports · synthetic sample data · review sheet only</p><div class="grid">${cards.join('')}</div></body></html>`);
      await preview.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
      await preview.screenshot({ path: path.join(output, 'previews', `${lang}-${profile}-overview.png`), fullPage: true });
      await preview.close();
    }
  }
} finally { await browser.close(); }
