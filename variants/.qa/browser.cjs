const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
// Проверка локальных файлов в настоящем Chromium.
const browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-pipe', '--user-data-dir=' + path.join(__dirname, 'profile')
], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'], windowsHide: true });
let sequence = 0, buffer = '';
const pending = new Map(), errors = [];
browser.stdio[4].on('data', chunk => {
  buffer += chunk.toString();
  let end;
  while ((end = buffer.indexOf('\0')) !== -1) {
    const message = JSON.parse(buffer.slice(0, end));
    buffer = buffer.slice(end + 1);
    if (message.id && pending.has(message.id)) {
      const callback = pending.get(message.id);
      pending.delete(message.id);
      message.error ? callback.reject(message.error) : callback.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params);
  }
});
function call(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    browser.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
  });
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const target = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const c = (method, params) => call(method, params, sessionId);
  const evaluate = async expression => {
    const result = await c('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await c('Runtime.enable');
  await c('Page.enable');
  const results = [];
  for (const folder of ['01-slash', '02-spotlight', '03-kinetic', '04-timeline']) {
    const startErrors = errors.length;
    await c('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await c('Page.navigate', { url: pathToFileURL(path.resolve(__dirname, '..', folder, 'index.html')).href });
    for (let n = 0; n < 60; n++) {
      if (await evaluate("document.readyState === 'complete' && !!document.querySelector('.hero')")) break;
      await delay(200);
    }
    await evaluate("Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,5000))]).then(()=>true)");
    await delay(1000);
    const row = { folder, widths: [], errors: [] };
    for (const width of [360, 390, 768, 1024, 1440, 1920]) {
      await c('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await delay(100);
      row.widths.push(await evaluate(`({
        width: innerWidth, pageWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll('h1,h2,h3,p,.todo,.button')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({text:e.textContent.slice(0,50),width:e.clientWidth,scroll:e.scrollWidth}))
      })`));
    }
    await c('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 1, mobile: false });
    await delay(150);
    await evaluate("scrollTo({top:0,behavior:'instant'}); document.querySelector('.menu').click()");
    row.menuOpen = await evaluate("document.querySelector('.menu').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('nav')).display!=='none'");
    await c('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    row.escape = await evaluate("document.querySelector('.menu').getAttribute('aria-expanded')==='false'");
    await evaluate("document.querySelector('.menu').click(); document.querySelector('nav a[href=\"#projects\"]').click()");
    row.linkCloses = await evaluate("document.querySelector('.menu').getAttribute('aria-expanded')==='false'");
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await delay(500);
    let shot = await c('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, folder + '-mobile.png'), Buffer.from(shot.data, 'base64'));
    await c('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await delay(300);
    shot = await c('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, folder + '-desktop.png'), Buffer.from(shot.data, 'base64'));
    await c('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await delay(100);
    row.reducedMotion = await evaluate("![...document.querySelectorAll('.reveal')].some(e=>getComputedStyle(e).opacity==='0') && !document.getAnimations().some(a=>a.playState==='running')");
    row.sections = await evaluate("[...document.querySelectorAll('main section')].map(e=>e.id)");
    row.fonts = await evaluate("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)");
    row.errors = errors.slice(startErrors);
    await c('Emulation.setEmulatedMedia', { features: [] });
    await delay(150);
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    if (folder === '03-kinetic' || folder === '04-timeline') {
      const selector = folder === '03-kinetic' ? '.kinetic-word' : '.timeline-fill';
      const before = await evaluate(`getComputedStyle(document.querySelector('${selector}')).transform`);
      await evaluate("document.querySelector('#achievements').scrollIntoView({behavior:'instant'})");
      await delay(150);
      const after = await evaluate(`getComputedStyle(document.querySelector('${selector}')).transform`);
      row.scrollEffect = before !== after;
    }
    if (folder === '02-spotlight') {
      row.pointerMedia = await evaluate("({fine:matchMedia('(hover: hover) and (pointer: fine)').matches,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,hero:document.querySelector('.hero').getBoundingClientRect().top})");
      await c('Input.dispatchMouseEvent', { type:'mouseMoved', x: 300, y: 400 });
      await delay(100);
      row.pointerEffect = await evaluate("document.querySelector('.spotlight').style.transform.includes('translate')");
    }
    await c('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'reduce' }] });
    await evaluate("document.querySelector('#achievements').scrollIntoView({behavior:'instant'})");
    await delay(100);
    const detailShot = await c('Page.captureScreenshot', { format:'png' });
    fs.writeFileSync(path.join(__dirname, folder + '-achievements.png'), Buffer.from(detailShot.data, 'base64'));
    await c('Emulation.setEmulatedMedia', { features: [] });
    results.push(row);
    console.log(JSON.stringify(row));
  }
  fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(results, null, 2));
  await call('Browser.close');
})().catch(error => { console.error(error); browser.kill(); process.exitCode = 1; });
setTimeout(() => { browser.kill(); process.exit(1); }, 90000).unref();

