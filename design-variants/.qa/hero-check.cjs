const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
// Проверка двух локальных вариантов в Chromium.
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
  const target = await call('Target.createTarget', {url:'about:blank'});
  const {sessionId} = await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
  const c = (method,params={}) => call(method,params,sessionId);
  const e = async expression => {
    const r = await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const assert = (ok, message) => { if(!ok) throw Error(message); };
  await c('Runtime.enable'); await c('Page.enable');
  // Сеть отключена: всё должно работать и при открытии двойным кликом.
  await c('Network.enable');
  await c('Network.setBlockedURLs',{urls:['*fonts.googleapis.com*','*fonts.gstatic.com*']});
  const results=[];
  for(const [name,file] of [['01','variant-01.html'],['10','10-route/index.html']]) {
    if(process.argv[2] && name !== process.argv[2]) continue;
    const errorStart=errors.length;
    await c('Emulation.setEmulatedMedia',{features:[]});
    await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await c('Page.navigate',{url:pathToFileURL(path.resolve(__dirname,'..',file)).href});
    for(let i=0;i<50;i++) { if(await e("document.readyState==='complete' && !!window.EnactusI18n && document.querySelectorAll('.hero-dots button').length===5")) break; await delay(100); }
    await e("document.activeElement.blur(); localStorage.removeItem('enactus-language'); document.querySelector('[data-language=ru]').click(); document.activeElement.blur()");
    const row={name,widths:[]};
    for(const lang of ['ru','en']) {
      await e(`document.querySelector('[data-language=${lang}]').click(); document.activeElement.blur()`);
      assert(await e(`document.documentElement.lang==='${lang}'`),'language '+name);
      for(const width of [360,390,650,768,980,1024,1100,1280,1440,1920]) {
        await c('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
        await delay(70);
        const check=await e(`({lang:document.documentElement.lang,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,textOverflow:[...document.querySelectorAll('h1,h2,h3,p,.hero-action,.language-switch,header')].filter(x=>x.clientWidth>0 && x.scrollWidth>x.clientWidth+2).map(x=>x.className||x.tagName)})`);
        row.widths.push(check);
        assert(!check.overflow && !check.textOverflow.length,JSON.stringify(check));
      }
    }
    await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await e("document.querySelector('[data-language=ru]').click(); document.activeElement.blur(); scrollTo({top:0,behavior:'instant'})");
    await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    await delay(4300);
    row.autoplay=await e("document.querySelector('.hero-dots button[aria-pressed=true]').dataset.slide!=='0'");
    assert(row.autoplay,'autoplay '+name);
    await delay(2100);
    row.phrases=await e("document.querySelector('[data-phrase].is-active').dataset.i18n==='phrase1'");
    assert(row.phrases,'phrase rotation '+name);
    await e("document.querySelector('.shared-hero').dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}))");
    assert(await e("document.querySelector('.shared-hero').classList.contains('is-paused')"),'hover pause');
    await e("document.querySelector('.shared-hero').dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'})); document.querySelector('.hero-dots button').focus()");
    assert(await e("document.querySelector('.shared-hero').classList.contains('is-paused')"),'focus pause');
    await e("document.activeElement.blur(); Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange'))");
    assert(await e("document.querySelector('.shared-hero').classList.contains('is-paused')"),'hidden pause');
    await e("delete document.hidden; document.dispatchEvent(new Event('visibilitychange'))");
    await e("document.querySelector('.hero-pause').click(); document.activeElement.blur()");
    const active=await e("document.querySelector('.hero-dots button[aria-pressed=true]').dataset.slide");
    await delay(4200);
    assert(active===await e("document.querySelector('.hero-dots button[aria-pressed=true]').dataset.slide"),'pause '+name);
    await e("document.querySelectorAll('.hero-dots button')[3].click()");
    assert(await e("document.querySelectorAll('.hero-dots button')[3].getAttribute('aria-pressed')==='true'"),'dots '+name);
    await e("document.querySelectorAll('.hero-dots button')[3].focus()");
    await c('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
    await c('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
    assert(await e("document.querySelectorAll('.hero-dots button')[4].getAttribute('aria-pressed')==='true'"),'keyboard '+name);
    await e("document.activeElement.blur(); document.querySelector('[data-language=en]').click(); document.activeElement.blur()");
    row.storage=await e("localStorage.getItem('enactus-language')==='en'"); assert(row.storage,'storage');
    await c('Page.reload'); await delay(350);
    assert(await e("document.documentElement.lang==='en'"),'persistence '+name);
    await e("document.querySelector('[data-language=ru]').click(); document.activeElement.blur()");
    await c('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await delay(100);
    assert(await e("document.querySelectorAll('.hero-dots button')[0].getAttribute('aria-pressed')==='true'"),'motion first slide');
    await delay(4300);
    row.reduced=await e("document.querySelectorAll('.hero-dots button')[0].getAttribute('aria-pressed')==='true' && document.getAnimations().filter(a=>a.playState==='running').length===0");
    assert(row.reduced,'reduced motion '+name);
    await e("document.querySelectorAll('.hero-dots button')[2].click()");
    assert(await e("document.querySelectorAll('.hero-dots button')[2].getAttribute('aria-pressed')==='true'"),'manual reduced');
    // Скриншоты без движения для проверки композиции и читаемости.
    for(const width of [1440,360]) {
      await c('Emulation.setDeviceMetricsOverride',{width,height:name==='01' && width===1440 ? 1360 : 1000,deviceScaleFactor:1,mobile:false});
      await e("document.activeElement.blur(); scrollTo({top:0,behavior:'instant'})"); await delay(150);
      const shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(__dirname,`hero-${name}-${width}.png`),Buffer.from(shot.data,'base64'));
    }
    const menuSelector=name==='01'?'.menu':'.menu-toggle';
    await e(`document.querySelector('${menuSelector}').click()`);
    assert(await e(`document.querySelector('${menuSelector}').getAttribute('aria-expanded')==='true'`),'mobile menu');
    if(name==='10') {
      await e("document.querySelector('.drop-toggle').click()");
      assert(await e("document.querySelector('.drop-toggle').getAttribute('aria-expanded')==='true'"),'submenu');
    }
    await e("document.querySelector('nav a[href=\"#about\"]').click()");
    assert(await e(`document.querySelector('${menuSelector}').getAttribute('aria-expanded')==='false'`),'close mobile menu');
    const blocker=await c('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})"});
    await c('Page.reload'); await delay(350);
    await e("document.querySelector('[data-language=en]').click()");
    row.blockedStorage=await e("document.documentElement.lang==='en'");
    assert(row.blockedStorage,'blocked localStorage');
    await c('Page.removeScriptToEvaluateOnNewDocument',{identifier:blocker.identifier});
    await e("Promise.all([...document.images].map(x=>{x.loading='eager';return x.decode().catch(()=>{})})).then(()=>true)");
    row.images=await e("[...document.images].filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src)");
    row.errors=errors.slice(errorStart);
    results.push(row);
  }
  fs.writeFileSync(path.join(__dirname,'hero-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results.map(({name,autoplay,phrases,storage,blockedStorage,reduced,images,errors,widths})=>({name,autoplay,phrases,storage,blockedStorage,reduced,images,errors,layouts:widths.length})),null,2));
  assert(results.every(x=>!x.errors.length && !x.images.length),'errors/images');
  await call('Browser.close');
})().catch(error=>{ console.error(error); browser.kill(); process.exitCode=1; });
