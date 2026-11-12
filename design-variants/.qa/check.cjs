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
  const folders = process.argv.slice(2).length ? process.argv.slice(2) : ['05-prism','06-panorama','07-stack','10-route'];
  for (const folder of folders) {
    const startErrors = errors.length;
    await c('Emulation.setEmulatedMedia', { features: [] });
    await c('Emulation.setDeviceMetricsOverride', { width:1440,height:1000,deviceScaleFactor:1,mobile:false });
    await c('Page.navigate',{url:pathToFileURL(path.resolve(__dirname,'..',folder,'index.html')).href});
    for (let n=0;n<80;n++) {
      if (await evaluate("document.readyState==='complete' && !!document.querySelector('.site-header')")) break;
      await delay(150);
    }
    await evaluate("Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]).then(()=>true)");
    await delay(1600);
    const row={folder,widths:[]};
    for (const width of [360,390,650,768,980,1024,1280,1440,1920]) {
      await c('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
      await delay(100);
      row.widths.push(await evaluate(`({
        width:innerWidth,
        overflow:document.documentElement.scrollWidth>innerWidth,
        textOverflow:[...document.querySelectorAll('h1,h2,h3,p,.todo,.button')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+2).map(e=>({text:e.textContent.slice(0,65),width:e.clientWidth,scroll:e.scrollWidth}))
      })`));
    }
    await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await delay(150);
    await evaluate("scrollTo({top:0,behavior:'instant'}); document.activeElement.blur()");
    const first = await evaluate("(()=>{const r=document.querySelector('.nav-group').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:first.x,y:first.y});
    await delay(250);
    row.hoverOpens = await evaluate("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='true'");
    await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:20,y:500});
    await evaluate("document.querySelector('.nav-group .nav-link').focus()");
    row.focusOpens = await evaluate("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='true'");
    await evaluate("document.querySelector('.drop-toggle').focus()");
    await c('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
    row.arrowEnters = await evaluate("!!document.activeElement.closest('.submenu')");
    await c('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    row.desktopEscape = await evaluate("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='false' && document.activeElement.classList.contains('drop-toggle')");
    await evaluate("document.activeElement.blur();scrollTo({top:0,behavior:'instant'})");
    await delay(200);
    let shot=await c('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(__dirname,folder+'-desktop.png'),Buffer.from(shot.data,'base64'));
    await c('Emulation.setDeviceMetricsOverride',{width:360,height:800,deviceScaleFactor:1,mobile:false});
    await delay(150);
    await evaluate("document.querySelector('.menu-toggle').click()");
    row.mobileMenu = await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('.navigation')).display!=='none'");
    await evaluate("document.querySelector('.drop-toggle').click()");
    row.accordion = await evaluate("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('.submenu')).display!=='none'");
    await evaluate("document.querySelector('.submenu a').focus()");
    await c('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    row.mobileSubEscape = await evaluate("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='false'");
    await c('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    row.mobileEscape = await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'");
    await evaluate("document.querySelector('.menu-toggle').click();document.querySelector('.nav-link[href=\"#projects\"]').click()");
    row.anchorCloses = await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false' && document.activeElement.id==='projects'");
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await delay(300);
    shot=await c('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(__dirname,folder+'-mobile.png'),Buffer.from(shot.data,'base64'));
    await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await delay(150);
    if(folder==='06-panorama'||folder==='10-route') {
      const selector=folder==='06-panorama'?'.panorama-window':'.route-line i';
      await evaluate("scrollTo({top:0,behavior:'instant'})");
      await delay(100);
      const before=await evaluate(`getComputedStyle(document.querySelector('${selector}')).transform`);
      await evaluate(folder==='06-panorama'?"scrollTo({top:650,behavior:'instant'})":"document.querySelector('.awards').scrollIntoView({behavior:'instant'})");
      await delay(150);
      const after=await evaluate(`getComputedStyle(document.querySelector('${selector}')).transform`);
      row.signature=before!==after;
    }
    if(folder==='07-stack') {
      await evaluate("scrollTo({top:document.querySelector('.project').getBoundingClientRect().top+scrollY+100,behavior:'instant'})");
      await delay(900);
      row.stickyState=await evaluate("({position:getComputedStyle(document.querySelector('.project')).position,top:document.querySelector('.project').getBoundingClientRect().top,transform:getComputedStyle(document.querySelector('.project')).transform})");
      row.signature=await evaluate("getComputedStyle(document.querySelector('.project')).position==='sticky' && Math.abs(document.querySelector('.project').getBoundingClientRect().top-130)<3");
    }
    if(folder==='05-prism') row.signature=await evaluate("getComputedStyle(document.querySelector('.shutters i')).transform!=='none'");
    await c('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await delay(150);
    row.reduced = await evaluate("![...document.querySelectorAll('.reveal')].some(e=>getComputedStyle(e).opacity==='0')&&!document.getAnimations().some(a=>a.playState==='running')");
    const imgCount = await evaluate("document.images.length");
    for(let n=0;n<imgCount;n++) {
      await evaluate(`document.images[${n}].scrollIntoView({behavior:'instant'})`);
      await delay(80);
    }
    row.images=await evaluate("[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,alt:!!i.alt,dimensions:!!i.getAttribute('width')&&!!i.getAttribute('height')}))");
    for(const [label,selector] of [['footer','.site-footer'],['projects','#projects'],['awards','#achievements']]) {
      await evaluate(`document.querySelector('${selector}').scrollIntoView({behavior:'instant'})`);
      await delay(100);
      shot=await c('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(__dirname,folder+'-'+label+'.png'),Buffer.from(shot.data,'base64'));
    }
    row.errors=errors.slice(startErrors);
    results.push(row);
    console.log(JSON.stringify(row));
  }
  fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(results,null,2));
  await call('Browser.close');
})().catch(error=>{console.error(error);browser.kill();process.exitCode=1});
setTimeout(()=>{browser.kill();process.exit(1)},120000).unref();

