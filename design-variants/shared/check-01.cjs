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
  const target=await call('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
  const c=(method,params={})=>call(method,params,sessionId);
  const e=async expression=>{
    const r=await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const assert=(ok,message)=>{if(!ok)throw Error(message)};
  await c('Runtime.enable');await c('Page.enable');await c('Network.enable');
  await c('Network.setBlockedURLs',{urls:['*fonts.googleapis.com*','*fonts.gstatic.com*']});
  await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  const url=pathToFileURL(path.resolve(__dirname,'../variant-01.html')).href;
  async function loaded(){for(let i=0;i<50;i++){if(await e("document.readyState==='complete' && !!document.querySelector('.hero-01[data-intro]')"))return;await delay(30)}throw Error('load timeout')}
  const cleaner=await c('Page.addScriptToEvaluateOnNewDocument',{source:"sessionStorage.removeItem('enactus-01-intro');localStorage.removeItem('enactus-language')"});
  await c('Page.navigate',{url});await loaded();
  const result={firstIntro:await e("document.querySelector('.hero-01').dataset.intro==='playing'"),reloads:[],layouts:[]};
  assert(result.firstIntro,'first intro did not run');
  await c('Page.removeScriptToEvaluateOnNewDocument',{identifier:cleaner.identifier});
  await delay(1650);
  assert(await e("document.querySelector('.hero-01').dataset.intro==='complete'"),'intro deadline');
  for(let i=0;i<3;i++){
    await c('Page.reload');await loaded();
    result.reloads.push(await e("document.querySelector('.hero-01').dataset.intro==='complete' && !document.querySelector('.intro-playing')"));
  }
  assert(result.reloads.every(Boolean),'intro replayed on reload');
  await e("sessionStorage.removeItem('enactus-01-intro')");await c('Page.reload');await loaded();
  const next=await e("(()=>{const r=document.querySelector('.hero-photo-scene').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
  await c('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...next});
  await c('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...next});
  result.clickSkip=await e("document.querySelector('.hero-01').dataset.intro==='complete' && document.querySelectorAll('.hero-dots button')[0].getAttribute('aria-pressed')==='true'");
  assert(result.clickSkip,'click skip blocked control');
  await e("sessionStorage.removeItem('enactus-01-intro')");await c('Page.reload');await loaded();
  await c('Input.dispatchKeyEvent',{type:'keyDown',key:'Shift',code:'ShiftLeft',windowsVirtualKeyCode:16});
  await c('Input.dispatchKeyEvent',{type:'keyUp',key:'Shift',code:'ShiftLeft',windowsVirtualKeyCode:16});
  result.keySkip=await e("document.querySelector('.hero-01').dataset.intro==='complete'");assert(result.keySkip,'key skip');
  await e("document.activeElement.blur();scrollTo({top:0,behavior:'instant'})");
  await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
  await delay(4200);
  result.staticPhoto=await e("document.querySelectorAll('.hero-dots button').length===1 && document.querySelectorAll('.hero-dots button')[0].getAttribute('aria-pressed')==='true'");assert(result.staticPhoto,'single photo');
  await delay(2000);
  result.quotes=await e("document.querySelector('.hero-followup [data-phrase].is-active').dataset.i18n==='phrase1'");assert(result.quotes,'followup rotation');
  await e("scrollTo({top:200,behavior:'instant'})");await delay(100);
  result.parallax=await e("document.querySelector('.hero-wedge').style.transform.includes('translateY') && document.querySelector('.hero-photo-motion').style.transform!=='translateY(0px)'");assert(result.parallax,'parallax');
  const blocked=await c('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError')}})"});
  await c('Page.reload');await loaded();
  result.blockedSession=await e("document.querySelector('.hero-01').dataset.intro==='playing'");assert(result.blockedSession,'blocked session');
  await e("document.dispatchEvent(new Event('click'))");
  await c('Page.removeScriptToEvaluateOnNewDocument',{identifier:blocked.identifier});
  await c('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await c('Page.reload');await loaded();await delay(100);
  result.reduced=await e("document.querySelector('.hero-01').dataset.intro==='complete' && document.getAnimations().filter(a=>a.playState==='running').length===0 && !document.querySelector('.hero-wedge').style.transform");assert(result.reduced,'reduced motion');
  for(const lang of ['ru','en']){
    await e(`document.querySelector('[data-language=${lang}]').click()`);
    for(const width of [360,390,650,768,980,1100,1440,1920]){
      await c('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(40);
      const layout=await e("({lang:document.documentElement.lang,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('h1').scrollWidth>document.querySelector('h1').clientWidth+1})");
      assert(!layout.overflow&&!layout.title,JSON.stringify(layout));result.layouts.push(layout);
    }
  }
  await e("document.querySelector('[data-language=ru]').click();document.activeElement.blur();document.querySelector('.hero-dots button').click();document.activeElement.blur();Promise.all([...document.images].map(x=>{x.loading='eager';return x.decode()})).then(()=>true)");
  for(const [width,height] of [[1440,1000],[360,900]]){
    await c('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await e("scrollTo({top:0,behavior:'instant'})");await delay(80);
    const shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:width===1440?1580:1540,scale:1}});
    fs.writeFileSync(path.join(__dirname,`preview-01-${width}.png`),Buffer.from(shot.data,'base64'));
  }
  result.images=await e("[...document.querySelectorAll('.hero-slide img')].filter(x=>!x.naturalWidth).map(x=>x.src)");
  assert(!result.images.length,'images');result.errors=errors;assert(!errors.length,'console errors');
  fs.writeFileSync(path.join(__dirname,'check-01-results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));await call('Browser.close');
})().catch(error=>{console.error(error);browser.kill();process.exitCode=1});
