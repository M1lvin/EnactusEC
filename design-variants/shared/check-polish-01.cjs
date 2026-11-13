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
(async()=>{
 const target=await call('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await call('Target.attachToTarget',{targetId:target.targetId,flatten:true});
 const c=(method,params={})=>call(method,params,sessionId);
 const e=async expression=>{const r=await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 await c('Runtime.enable');await c('Page.enable');await c('Network.enable');
 await c('Network.setBlockedURLs',{urls:['*fonts.googleapis.com*','*fonts.gstatic.com*']});
 await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await c('Page.navigate',{url:pathToFileURL(path.resolve(__dirname,'../variant-01.html')).href});
 for(let i=0;i<60;i++){if(await e("document.readyState==='complete' && !!document.querySelector('.hero-01[data-intro]')"))break;await delay(50)}
 await e("document.dispatchEvent(new Event('click'));document.querySelector('[data-language=ru]').click();document.activeElement.blur();Promise.all([...document.images].map(x=>{x.loading='eager';return x.decode()})).then(()=>true)");
 const result={layouts:[]};
 result.photo=await e("(()=>{const x=document.querySelector('.hero-slide img');return {width:x.naturalWidth,height:x.naturalHeight,src:x.getAttribute('src'),slides:document.querySelectorAll('.hero-slide').length}})()");
 assert(result.photo.width===2560 && result.photo.height===1706 && result.photo.slides===1,'original photo');
 assert(await e("document.querySelector('.hero-next').hidden && document.querySelector('.hero-controls').hidden"),'single photo controls');
 assert(await e("![...document.querySelectorAll('.nav-primary')].some(x=>x.hash==='#contacts')"),'top contacts removed');
 const count=await e("document.querySelectorAll('.nav-disclosure').length");assert(count===6,'six sections');
 for(let i=0;i<count;i++){
  await e(`document.querySelectorAll('.nav-disclosure')[${i}].click()`);
  assert(await e(`document.querySelectorAll('.nav-disclosure')[${i}].getAttribute('aria-expanded')==='true' && document.querySelectorAll('.nav-expand.expanded').length===1`),'disclosure '+i);
  assert(await e("[...document.querySelectorAll('.nav-expand.expanded .nav-panel a')].every(x=>!!document.querySelector(x.hash))"),'valid submenu anchors');
 }
 await c('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 await c('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 assert(await e("!document.querySelector('.nav-expand.expanded') && document.activeElement.matches('.nav-disclosure')"),'escape focus');
 await e("document.querySelectorAll('.nav-disclosure')[1].click();document.querySelector('.hero-01').click()");
 assert(await e("!document.querySelector('.nav-expand.expanded')"),'outside close');
 for(const lang of ['ru','en']){
  await e(`document.querySelector('[data-language=${lang}]').click()`);
  for(const width of [360,390,650,768,980,1100,1101,1280,1440,1920]){
   await c('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(40);
   const layout=await e("({lang:document.documentElement.lang,width:innerWidth,header:document.querySelector('header').getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth,navOverflow:document.querySelector('nav').clientWidth>0 && document.querySelector('nav').scrollWidth>document.querySelector('nav').clientWidth+2})");
   assert(!layout.overflow&&!layout.navOverflow,JSON.stringify(layout));result.layouts.push(layout);
  }
 }
 await c('Emulation.setDeviceMetricsOverride',{width:360,height:900,deviceScaleFactor:1,mobile:false});
 await delay(150);
 await e("document.querySelector('[data-language=ru]').click();document.querySelector('.menu').click();document.querySelectorAll('.nav-disclosure')[2].click()");
 await delay(200);
 assert(await e("document.querySelector('.menu').getAttribute('aria-expanded')==='true' && !document.querySelector('#panel-projects').hidden"),'mobile accordion '+await e("JSON.stringify({header:document.querySelector('header').className,menu:document.querySelector('.menu').outerHTML,panelHidden:document.querySelector('#panel-projects').hidden,expanded:document.querySelectorAll('.nav-expand.expanded').length})"));
 assert(await e("document.querySelector('#panel-projects').getBoundingClientRect().height>50"),'mobile panel rendered');
 const mobile=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'preview-01-mobile-menu.png'),Buffer.from(mobile.data,'base64'));
 await e("document.querySelector('#panel-projects a').click()");
 assert(await e("document.querySelector('.menu').getAttribute('aria-expanded')==='false' && !document.querySelector('.nav-expand.expanded')"),'mobile close by link');
 await c('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await e("document.activeElement.blur();scrollTo({top:0,behavior:'instant'})");await delay(100);
 assert(await e("document.getAnimations().filter(x=>x.playState==='running').length===0"),'reduced motion');
 for(const [width,height,clipHeight] of [[1440,1000,1590],[360,900,1250]]){
  await c('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await e("scrollTo({top:0,behavior:'instant'})");await delay(100);
  const shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:clipHeight,scale:1}});fs.writeFileSync(path.join(__dirname,`preview-01-${width}.png`),Buffer.from(shot.data,'base64'));
 }
 await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(150);await e("document.querySelectorAll('.nav-disclosure')[1].click()");await delay(250);
 assert(await e("!document.querySelector('#panel-about').hidden"),'desktop screenshot menu');
 const menu=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'preview-01-menu.png'),Buffer.from(menu.data,'base64'));
 result.errors=errors;assert(!errors.length,'console errors');result.menu=true;result.mobile=true;result.reduced=true;
 fs.writeFileSync(path.join(__dirname,'check-polish-01-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await call('Browser.close');
})().catch(err=>{console.error(err);browser.kill();process.exitCode=1});
