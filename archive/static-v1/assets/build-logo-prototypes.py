from pathlib import Path
import base64
import html

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'logo-prototypes'
OUT.mkdir(exist_ok=True)
SOURCE = Path('C:/Users/Master/AppData/Local/Temp/codex-clipboard-61f4396c-dc9c-47f3-9848-75614269aab5.png')
data = base64.b64encode(SOURCE.read_bytes()).decode()
# Original mark and original lettering are clipped separately, never redrawn.
variants = [
 ('Классика', 'classic', 'Arial', 23, 400, 0, 'left', ''),
 ('Лёгкая подпись', 'classic', 'Segoe UI', 24, 300, 0, 'left', ''),
 ('Точный центр', 'classic', 'Arial', 22, 400, .7, 'center', ''),
 ('Уверенный штрих', 'classic', 'Arial', 21, 700, .3, 'left', ''),
 ('Золотая линия', 'classic', 'Segoe UI', 22, 400, 0, 'left', 'rule'),
 ('Горизонталь', 'horizontal', 'Arial', 23, 400, 0, 'left', ''),
 ('Инженерный ритм', 'horizontal', 'Consolas', 21, 400, -.3, 'left', ''),
 ('Разделитель', 'horizontal', 'Segoe UI', 22, 400, 0, 'left', 'divider'),
 ('Воздух', 'horizontal', 'Arial', 20, 400, 1.7, 'center', ''),
 ('Опорная линия', 'horizontal', 'Arial', 21, 600, .3, 'left', 'underline'),
 ('Вертикальный знак', 'stack', 'Segoe UI', 24, 400, .2, 'center', ''),
 ('Академический', 'stack', 'Georgia', 25, 400, 0, 'center', ''),
 ('Собранный', 'stack-small', 'Arial', 22, 700, .5, 'center', ''),
 ('Открытая рамка', 'stack-small', 'Segoe UI', 22, 400, .4, 'center', 'corners'),
 ('Подпись между линиями', 'stack-small', 'Arial', 20, 400, 0, 'center', 'sides'),
 ('Широкая подпись', 'classic', 'Arial', 25, 400, 1.0, 'center', 'wide'),
 ('Две строки', 'horizontal', 'Segoe UI', 23, 400, .5, 'left', 'two'),
 ('Колледж — акцент', 'horizontal', 'Georgia', 25, 400, 0, 'left', ''),
 ('Тонкая плашка', 'classic', 'Arial', 19, 400, .8, 'center', 'pill'),
 ('Подпись с отступом', 'classic', 'Segoe UI', 22, 600, .2, 'right', ''),
]

def svg(i, v, theme):
    name, layout, font, size, weight, spacing, align, ornament = v
    ink = '#f5f6f7' if theme == 'dark' else '#505254'
    if layout == 'classic':
        mx,my,mw = 53,36,159
        wx,wy,ww = 137,163,363
        tx,ty,tw = 140,271,360
    elif layout == 'horizontal':
        mx,my,mw = 42,95,143
        wx,wy,ww = 206,131,340
        tx,ty,tw = 208,239,337
    else:
        mx,my,mw = (244,20,112) if layout == 'stack' else (257,31,86)
        wx,wy,ww = 148,153,304
        tx,ty,tw = 145,251,310
    wh = ww*248/1235
    x = tx if align == 'left' else (tx+tw if align == 'right' else tx+tw/2)
    anchor = {'left':'start','right':'end','center':'middle'}[align]
    accents = ''
    if ornament == 'rule':
        accents = f'<path d="M{tx} {ty-30}h{tw}" stroke="#ffc20e" stroke-width="2"/>'
        ty += 7
    if ornament == 'underline':
        accents = f'<path d="M{tx} {ty+17}h65" stroke="#ffc20e" stroke-width="3"/>'
    if ornament == 'divider':
        accents = '<path d="M192 102v153" stroke="#ffc20e" stroke-width="2"/>'
    if ornament == 'corners':
        accents = '<path d="M110 92V60h38 M452 60h38v32 M110 248v32h38 M452 280h38v-32" fill="none" stroke="#ffc20e" stroke-width="2"/>'
    if ornament == 'sides':
        accents = f'<path d="M100 {ty-7}h35 M465 {ty-7}h35" stroke="#ffc20e" stroke-width="2"/>'
    if ornament == 'wide':
        x,ty,anchor = 300,282,'middle'
    if ornament == 'pill':
        accents = f'<rect x="{tx-12}" y="{ty-26}" width="{tw+24}" height="39" rx="19.5" fill="none" stroke="{ink}" opacity=".55"/>'
    label = (f'<tspan x="{x}" dy="0">Engineering</tspan><tspan x="{x}" dy="27">College</tspan>'
             if ornament == 'two' else 'Engineering College')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="340" viewBox="0 0 600 340" role="img" aria-labelledby="title">
<title id="title">{i:02} · {name} · enactus Engineering College · {theme}</title>
<defs><image id="original" width="1523" height="666" xlink:href="data:image/png;base64,{data}"/>
<clipPath id="mark"><path d="M14 334H196V5L530 337H380L197 520Z"/></clipPath>
<filter id="ink" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feFlood flood-color="{ink}"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
<svg x="{mx}" y="{my}" width="{mw}" height="{mw}" viewBox="10 3 525 525"><use xlink:href="#original" clip-path="url(#mark)"/></svg>
<svg x="{wx}" y="{wy}" width="{ww}" height="{wh}" viewBox="280 418 1235 248"><use xlink:href="#original" filter="url(#ink)"/></svg>
{accents}<text x="{x}" y="{ty}" text-anchor="{anchor}" fill="{ink}" font-family="{font}, sans-serif" font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}">{label}</text></svg>'''

cards=[]
for i,v in enumerate(variants,1):
    for theme in ['light','dark']:
        (OUT/f'{i:02}-{theme}.svg').write_text(svg(i,v,theme),encoding='utf-8')
    cards.append(f'''<article id="v{i:02}"><header><span>{i:02}</span><h2>{html.escape(v[0])}</h2></header><div class="pair">'''+''.join(
        f'<div class="sample {theme}"><span class="theme">{"Светлая" if theme=="light" else "Тёмная"} тема</span><img src="assets/logo-prototypes/{i:02}-{theme}.svg" alt="Вариант {i}: enactus Engineering College, {theme}" loading="lazy"><a href="assets/logo-prototypes/{i:02}-{theme}.svg" download="enactus-ec-{i:02}-{theme}.svg">Скачать SVG ↗</a></div>'
        for theme in ['light','dark'])+'</div></article>')

page='''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enactus EC · 20 вариантов логотипа</title><style>
*{box-sizing:border-box}body{margin:0;background:#e9e9e5;color:#232629;font-family:Arial,sans-serif}main{max-width:1320px;margin:auto;padding:60px 32px 80px}.eyebrow{font-size:12px;letter-spacing:3px;text-transform:uppercase}h1{font-size:clamp(36px,5vw,66px);letter-spacing:-2px;margin:20px 0}p{max-width:780px;line-height:1.65;color:#5d6265}.intro{padding-bottom:36px;border-bottom:1px solid #c8cac6}.intro strong{color:#232629}nav{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 48px}nav a{padding:10px 13px;border:1px solid #c4c7c2;color:inherit;text-decoration:none;border-radius:6px}nav a:hover{background:#ffc20e}article{margin-bottom:38px;scroll-margin-top:20px}header{display:flex;align-items:center;gap:16px;margin-bottom:12px}header span{font-size:13px;color:#686d6f}h2{font-size:19px;font-weight:500;margin:0}.pair{display:grid;grid-template-columns:1fr 1fr;border:1px solid #d1d3ce;border-radius:12px;overflow:hidden}.sample{position:relative;padding:35px 20px 29px;display:flex;flex-direction:column;align-items:center}.light{background:#fff;color:#505254}.dark{background:#192025;color:#f5f6f7}.theme{align-self:flex-start;font-size:11px;letter-spacing:1px;opacity:.65}.sample img{width:100%;height:auto;display:block}.sample a{font-size:12px;text-decoration:none;color:inherit;opacity:.7;border-bottom:1px solid currentColor;padding-bottom:4px}.sample a:hover{opacity:1}footer{margin-top:50px;line-height:1.8;font-size:13px;color:#5d6265}footer a{color:inherit}@media(max-width:650px){main{padding:32px 16px}.pair{grid-template-columns:1fr}.sample{padding:24px 12px}nav{gap:6px}nav a{padding:8px 10px}}@media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
</style><main><section class="intro"><div class="eyebrow">Enactus EC / Исследование логотипа</div><h1>20 решений.<br>Две темы для каждого.</h1><p>Во всех вариантах сохранены исходный золотой знак и написание <strong>enactus</strong>. Подпись — <strong>Engineering College</strong>. Сравните композицию, характер шрифта и отступы. Каждая пара имеет одинаковую геометрию.</p><p>40 отдельных SVG с прозрачным фоном. Это прототипы для выбора; подпись использует системные шрифты.</p></section><nav aria-label="Перейти к варианту">'''
page+=''.join(f'<a href="#v{i:02}">{i:02}</a>' for i in range(1,21))+'</nav>'+''.join(cards)
page+='''<footer>Визуальные ориентиры: <a href="https://enactus.ca/">Канада</a> · <a href="https://enactus.fr/">Франция</a> · <a href="https://www.enactus.de/en">Германия</a> · <a href="https://enactus.org/">Enactus Global</a>.<br>Знак и написание enactus взяты из предоставленного PNG: SVG содержит растровый исходник. Подпись и декоративные линии — векторные.</footer></main></html>'''
(ROOT/'logo-prototypes.html').write_text(page,encoding='utf-8')
print('Created 40 SVG files and logo-prototypes.html')
