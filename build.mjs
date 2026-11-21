import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources, records, history, membership, secretariat, wechat } from './content.mjs';

const output = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const copy = {
  zh: { name: '亚洲血管生物学学会', home: '首页', society: '学会介绍', next: '澳门 2027', archive: '历届会议', sponsorship: '赞助招商', contact: '参会咨询', resources: '资料与图片', menu: '导航菜单', skip: '跳到正文', recap: '会议回顾', detail: '阅读会后报道' },
  en: { name: 'Asian Society for Vascular Biology', home: 'Home', society: 'Society', next: 'Macao 2027', archive: 'Past meetings', sponsorship: 'Sponsorship', contact: 'Meeting enquiries', resources: 'Sources & credits', menu: 'Navigation menu', skip: 'Skip to content', recap: 'Meeting archive', detail: 'Read the meeting report' }
};
const icons = {
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4m9-4v4M4 10h16m-12 4h2m4 0h2"/>',
  pin: '<path d="M19.5 10c0 5.4-7.5 11-7.5 11S4.5 15.4 4.5 10a7.5 7.5 0 1 1 15 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  lectern: '<path d="M3 4h18v11H3zM7 21l5-6 5 6M12 4V2m-5 9 3-3 2.8 2 3.7-3"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/>',
  book: '<path d="M3 4.5c3.2-.7 6.2-.3 9 1.6 2.8-1.9 5.8-2.3 9-1.6v14c-3.6-.7-6.4-.2-9 1.6-2.6-1.8-5.4-2.3-9-1.6ZM12 6v14"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>',
  image: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m21 16-5-5-9 8.5"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>'
};
const icon = (key) => `<svg class="icon" aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</svg>`;
const label = (text) => `<p class="eyebrow"><span></span>${text}</p>`;
const cite = (href, name) => `<a class="text-link" href="${href}">${name}</a>`;
const titleTheme = ['血管健康与疾病发生：机制与转化前沿探索', 'Vascular Health and Disease Pathogenesis: Exploring Mechanistic and Translational Frontiers'];
const route = (id) => `${id}.html`;
const publicBase = 'https://pkulhc.github.io/asvb-portal/';
const publicPage = (lang, page) => publicBase + (lang === 'en' ? 'en/' : '') + (page === 'index' ? '' : route(page));
const meetingGraphic = (v) => `assets/macao-2027-${v.lang}.jpg`;
function context(lang, page) {
  const english = lang === 'en';
  return {
    lang, page, english, c: copy[lang], root: english ? '../' : '',
    t: (zh, en) => english ? en : zh, value: pair => pair[english ? 1 : 0],
    archive: page === 'index' ? '#archive' : 'index.html#archive',
    alternate: (english ? '../' : 'en/') + route(page)
  };
}

function header(v) {
  const { c, page, root, english } = v;
  const tabs = [
    [c.home, 'index.html', page === 'index'],
    [c.society, 'society.html', page === 'society'],
    [c.next, 'macao-2027.html', page === 'macao-2027'],
    [c.archive, v.archive, records.some(r => r.id === page)],
    [c.sponsorship, 'sponsorship.html', page === 'sponsorship']
  ];
  return `<a class="skip" href="#main">${c.skip}</a>
    <header class="masthead" id="top"><div class="wrap header-inner">
      <a class="brand" href="index.html" aria-label="${c.name} · ${c.home}">
        <img width="55" height="55" src="${root}assets/society-logo.png" alt="">
        <span class="brand-lockup"><b>ASVB</b><span>${c.name}</span></span>
      </a>
      <div class="header-tools">
        <nav class="site-nav" id="site-nav" aria-label="${v.t('网站导航','Site navigation')}">
          ${tabs.map(([name,href,active])=>`<a href="${href}"${active?' class="is-current" aria-current="'+(href===v.archive?'location':'page')+'"':''}>${name}</a>`).join('')}
        </nav>
        <a class="lang-toggle" data-language href="${v.alternate}" lang="${english?'zh-CN':'en'}" hreflang="${english?'zh-CN':'en'}" aria-label="${english?'切换到中文':'Switch to English'}">${icon('globe')}<span>${english?'中文':'EN'}</span></a>
        <a class="contact-top" href="macao-2027.html#contact">${c.contact}</a>
        <button class="menu-toggle" type="button" aria-label="${c.menu}" aria-controls="site-nav" aria-expanded="false">${icon('menu')}${icon('close')}</button>
      </div>
    </div></header>`;
}
function footer(v) {
  const { c, t, root } = v;
  return `<footer class="footer"><div class="wrap">
    <div class="footer-main"><div class="footer-brand"><a href="index.html" class="footer-mark">ASVB</a><p>${c.name}</p></div>
    <nav aria-label="${t('页脚导航','Footer navigation')}"><a href="society.html">${c.society}</a><a href="macao-2027.html">${c.next}</a><a href="${v.archive}">${c.archive}</a><a href="sponsorship.html">${c.sponsorship}</a><a href="${root}downloads/ASVB2027-first-announcement.docx" download>${t('第一轮通知','First announcement')}</a></nav>
    <div class="footer-contact"><span>${t('大会秘书处','Meeting secretariat')}</span><a href="mailto:${secretariat}">${secretariat}</a><span>${t('微信','WeChat')} · ${wechat}</span></div></div>
    <div class="footer-line"><span>© 2026 Asian Society for Vascular Biology</span><a href="sources.html">${c.resources}</a></div>
  </div></footer>`;
}
function cityCredit(v) {
  return `<div class="city-credit"><span>${icon('pin')}${v.t('中国澳门 · 南湾湖','Nam Van Lake · Macao, China')}</span><small><a href="${sources.artist}">Diego Delso · delso.photo</a><i>/</i><a href="${sources.cityLicense}">CC BY-SA 3.0</a></small></div>`;
}
function plate(v) {
  return `<figure class="plate"><img width="1419" height="2140" loading="lazy" src="${v.root}assets/vascular-plate.webp" alt="${v.t('格雷解剖学中展示主动脉弓及其主要分支的彩色图版','Historical anatomical illustration of the aortic arch and its major branches')}">
    <figcaption><span>Gray’s Anatomy, 1918</span><b>${v.t('主动脉弓及其分支','The aortic arch and its branches')}</b><small>${v.t('第 505 图','Plate 505')}</small></figcaption>
  </figure>`;
}
function archiveCard(v,r) {
  return `<a href="${route(r.id)}" class="record-card">
    <div class="record-image ${r.id}"><img loading="lazy" width="1640" height="${r.year==='2026'?'716':'1093'}" src="${v.root}assets/${r.image}" alt="${v.value(r.alt)}"></div>
    <div class="record-heading"><div><span class="record-edition">${v.value(r.edition)}</span><h3>${v.value(r.city)} <em>${r.year}</em></h3></div><span class="record-link">${v.t('会议回顾','Read recap')}</span></div>
    <p class="record-meta">${v.value(r.date)} · ${v.value(r.venue)}</p>
    <p class="record-theme"><small>${v.value(r.themeLabel)}</small>${v.value(r.theme)}</p></a>`;
}
const meetingFiles = (v) => [
  ['ASVB2027-first-announcement.docx', v.t('第一轮通知','First announcement'), v.t('中英文 · DOCX','Bilingual · DOCX')],
  ['ASVB2027-attendance.docx', v.t('参会意向回执','Attendance intention form'), 'DOCX'],
  ['ASVB2027-abstract.docx', v.t('摘要模板','Abstract template'), 'DOCX'],
  ['ASVB2027-Macao.ics', v.t('加入日历','Add to calendar'), 'ICS']
];
const meetingFacts = (v) => [
  ['calendar', v.t('拟定会期','Planned dates'), v.t('<span class="nowrap">2027 年</span> <span class="nowrap">8 月 23–24 日</span>','<span class="nowrap">23–24 August 2027</span>')],
  ['pin', v.t('拟定会场','Proposed venue'), v.t('<span class="nowrap">中国澳门</span> · <span class="nowrap">澳门科技大学</span>','Macau University of Science and Technology')],
  ['lectern', v.t('交流形式','Format'), v.t('大会报告 · 青年学者论坛 · 壁报交流','Lectures · Young Scholar Forum · Posters')]
];
function enquiry(v, kind) {
  const zh = { sponsor: ['会议赞助咨询','我们希望支持的活动或合作设想是……'], booth: ['展位合作咨询','我们拟展示的产品、技术或服务是……'] }[kind];
  const en = { sponsor: ['Sponsorship enquiry','We are interested in supporting…'], booth: ['Exhibition enquiry','We would like to exhibit…'] }[kind];
  const subject = v.t(`澳门 ASVB 2027 · ${zh[0]}`,`ASVB Macao 2027 | ${en[0]}`);
  const body = v.t(
    `大会秘书处老师，您好！\r\n\r\n我是[单位名称]的[姓名]。${zh[1]}\r\n\r\n欢迎通过[邮箱或电话]与我联系。`,
    `Dear Meeting Secretariat,\r\n\r\nMy name is [name] and I represent [organization]. ${en[1]}\r\n\r\nYou can reach me at [email or phone].`
  );
  return `mailto:${secretariat}?subject=${encodeURIComponent(subject)}&amp;body=${encodeURIComponent(body)}`;
}
function home(v) {
  const { t, root, c } = v;
  return `<main id="main">
    <section class="hero home-hero" aria-labelledby="hero-title">
      <div class="home-hero-media"><img class="hero-image" width="1917" height="1279" fetchpriority="high" src="${root}assets/macao-tower-night.jpg" alt="${t('澳门塔与西湾大桥夜景','Macao Tower and the Sai Van Bridge at night')}"><div class="hero-shade"></div>
        <p class="city-credit"><span>${icon('pin')}${t('中国澳门 · 澳门塔','Macao Tower · Macao, China')}</span></p></div>
      <div class="wrap hero-inner">
        <div class="hero-copy">${label(t('第十二届学术会议 · 第一轮通知','12th Scientific Meeting · First announcement'))}
          <h1 id="hero-title">${t('澳门','Macao')} <em>2027</em></h1>
          <p class="hero-meeting">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p>
          <p class="hero-theme">${v.value(titleTheme)}</p>
          <dl class="hero-facts">${meetingFacts(v).slice(0,2).map(([sym,term,def])=>`<div>${icon(sym)}<dt>${term}</dt><dd>${def}</dd></div>`).join('')}</dl>
          <div class="hero-actions"><a class="btn btn-gold" href="macao-2027.html#announcement">${t('查看会议通知','Read the announcement')}</a><a class="btn btn-glass" href="${root}downloads/ASVB2027-first-announcement.docx" download>${icon('download')}${t('下载第一轮通知','Download announcement')}</a></div>
        </div>
      </div>
    </section>
    <section class="resource-band" aria-labelledby="resource-title"><div class="wrap">
      <h2 id="resource-title">${t('澳门参会资料','Meeting documents')}</h2>
      <div class="resource-links">${meetingFiles(v).map(([file,name])=>`<a href="${root}downloads/${file}" download>${icon(file.endsWith('.ics')?'calendar':'download')}${name}</a>`).join('')}<a href="macao-2027.html#share">${icon('share')}${t('会议宣传图','Meeting graphic')}</a></div>
    </div></section>
    <nav class="home-paths wrap" aria-label="${t('快速入口','Explore')}">
      <a href="macao-2027.html"><small>${t('第十二届会议','12th meeting')}</small><b>${t('澳门 2027 会议信息','Macao 2027 meeting')}</b><span>${t('日程、回执、摘要、住宿交通与联系','Programme, forms, abstracts, travel and contacts')}</span></a>
      <a href="#society"><small>${t('学会','The Society')}</small><b>${t('学会介绍','About ASVB')}</b><span>${t('宗旨、会员来源与会议沿革','Aims, membership and meeting history')}</span></a>
      <a href="#archive"><small>${t('2025 · 2026','2025 · 2026')}</small><b>${c.archive}</b><span>${t('深圳与新加坡会议回顾','Shenzhen and Singapore reports')}</span></a>
      <a href="sponsorship.html"><small>${t('合作','Partners')}</small><b>${c.sponsorship}</b><span>${t('会议赞助与展位合作咨询','Sponsorship and exhibition enquiries')}</span></a>
    </nav>
    <section id="society" class="society-section"><div class="wrap society-grid">
      <div class="society-copy">${label(t('学会介绍','The Society'))}<h2>${t('亚洲血管生物学学会','Asian Society for<br>Vascular Biology')}</h2>
        <p class="body-copy">${t('2005 年，首届 ASVB 学术会议在上海举行。学会汇聚亚太地区研究血管的基础科学家、临床研究者和青年学者，共同探讨血管功能、疾病机制与医学转化。','Since its first scientific meeting in Shanghai in 2005, ASVB has brought together basic scientists, clinicians and early-career researchers from across the Asia-Pacific to study vascular function and disease.')}</p>
        <p class="body-copy">${v.value(membership)}</p>
        ${cite('society.html',t('了解学会与会议沿革','About the Society and its history'))}
      </div>${plate(v)}
    </div></section>
    <section id="archive" class="archive-section"><div class="wrap">
      <div class="section-heading">${label(t('会议回顾','Meeting archive'))}<h2>${c.archive}</h2></div>
      <div class="record-grid">${records.map(r=>archiveCard(v,r)).join('')}</div>
    </div></section>
    <section class="partner-band" aria-labelledby="partner-title"><div class="wrap">
      <div><h2 id="partner-title">${t('会议赞助与展位合作','Sponsorship and exhibition')}</h2><p>${t('欢迎相关企业及机构与大会秘书处洽谈澳门 2027 的会议赞助和展位合作。','Companies and institutions are welcome to discuss sponsoring or exhibiting at Macao 2027 with the meeting secretariat.')}</p></div>
      <a class="btn btn-gold" href="sponsorship.html">${t('了解赞助招商','Sponsorship and exhibition')}</a>
    </div></section>
  </main>`;
}
function breadcrumb(v,name,parent) {
  const separator='<span aria-hidden="true">/</span>';
  return `<nav class="crumb" aria-label="${v.t('当前位置','Breadcrumb')}"><a href="index.html">${v.c.home}</a>${separator}${parent?`<a href="${parent.href}">${parent.name}</a>${separator}`:''}<span aria-current="page">${name}</span></nav>`;
}
function society(v) {
  const { t } = v;
  return `<main id="main">
    <section class="paper-intro"><div class="wrap">${breadcrumb(v,v.c.society)}
      <div class="society-grid"><div>${label(t('学会介绍','The Society'))}<h1>${v.c.name}</h1>
        <p class="lead">${t('ASVB 推动亚洲血管生物学与血管医学的研究、教育和学术交流，让大学、研究机构和医院的研究者在同一场会议上讨论共同的问题。','ASVB advances research, education and scientific exchange in vascular biology and medicine in Asia. Its meetings bring researchers from universities, institutes and hospitals into the same conversation.')}</p>
        <p class="body-copy">${v.value(membership)}</p></div>${plate(v)}</div></div>
    </section>
    <section class="wrap editorial-section"><div class="split-intro">${label(t('学术交流','Scientific exchange'))}<div><h2>${t('学会的工作','The work of the Society')}</h2>
      <p>${t('在学术会议上，基础科学家讨论血管内皮、平滑肌与周围组织如何调控血管功能，临床研究者带来疾病机制和治疗中的问题。纪念讲座、专题报告和壁报让这些问题在不同学科之间展开。','Scientific sessions connect work on the endothelium, vascular muscle and surrounding tissues with clinical questions about mechanisms and treatment. Named lectures, focused talks and posters give members several ways to discuss their findings.')}</p>
      <p>${t('学会也支持血管生物学教学和继续教育。青年学者论坛为研究生和青年研究人员提供口头展示与同行讨论的机会。','The Society supports the teaching of vascular biology and continuing education for scientists and physicians. The Young Scholar Forum gives postgraduate students and early-career investigators a place to present and discuss their research.')}</p></div></div></section>
    <section class="history-section"><div class="wrap split-intro"><div>${label(t('自 2005 年','Since 2005'))}<h2>${t('会议沿革','Meeting history')}</h2></div>
      <ol class="timeline">${history.map(([year,place,summary,id])=>`<li><em>${year}</em><div><h3>${id?`<a href="${route(id)}">${v.value(place)}</a>`:v.value(place)}</h3><p>${v.value(summary)}</p></div></li>`).join('')}</ol>
    </div></section>
  </main>`;
}
function download(v, file, name, format='DOCX') {
  return `<a class="download-row" href="${v.root}downloads/${file}" download>${icon('download')}<span>${name}</span><small>${format}</small></a>`;
}
function meeting(v) {
  const { t,c,root }=v;
  const timetable=[
    ['22',t('周日','Sunday'),t('会前活动','Pre-meeting activities'),[[t('下午','Afternoon'),'Council Meeting'],[t('晚上','Evening'),t('嘉宾晚宴（拟；地点待确认）','Invited-guest dinner (planned; venue to be confirmed)')]]],
    ['23',t('周一','Monday'),t('学术会议 · 全天','Scientific sessions · full day'),[[t('全天','Full day'),t('大会报告、青年学者论坛及壁报交流','Scientific sessions, Young Scholar Forum and poster presentations')],[t('晚上','Evening'),t('全体参会人员晚宴（拟；地点及参加规则待确认）','Conference dinner for all participants (planned; venue and attendance arrangements to be confirmed)')]]],
    ['24',t('周二','Tuesday'),t('学术会议 · 上午','Scientific sessions · morning'),[[t('上午','Morning'),t('学术报告及闭幕','Scientific sessions and closing')]]]
  ];
  const nav=[['materials',t('资料下载','Documents')],['announcement',t('会议通知','Announcement')],['programme',t('初步日程','Programme')],['participate',t('回执与注册','Registration')],['abstracts',t('摘要征集','Abstracts')],['travel',t('住宿交通','Travel')],['organisation',t('组织机构','Organization')],['contact',t('秘书处','Secretariat')],['sponsors',t('赞助与展位','Sponsorship')],['share',t('宣传图','Graphics')]];
  const graphics=[['zh','中文宣传图','Chinese graphic','二维码指向中文会议页','QR code opens the Chinese page'],['en','英文宣传图','English graphic','二维码指向英文会议页','QR code opens the English page']];
  const ordered = v.english ? [graphics[1],graphics[0]] : graphics;
  return `<main id="main">
    <section class="meeting-banner"><img src="${root}assets/macao-waterfront.webp" class="hero-image" width="1920" height="899" alt="" fetchpriority="high"><div class="hero-shade"></div><div class="wrap">
      ${breadcrumb(v,c.next)}${label(t('第十二届学术会议','12th Scientific Meeting'))}<h1>${t('澳门','Macao')} <em>2027</em></h1>
      <p class="feature-title">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p><p class="banner-theme">${v.value(titleTheme)}</p>
      <dl class="hero-facts banner-facts">${meetingFacts(v).slice(0,2).map(([sym,term,def])=>`<div>${icon(sym)}<dt>${term}</dt><dd>${def}</dd></div>`).join('')}</dl>
      ${cityCredit(v)}</div></section>
    <nav class="section-nav" aria-label="${t('会议页面目录','On this page')}"><div class="wrap">${nav.map(([id,name])=>`<a href="#${id}">${name}</a>`).join('')}</div></nav>
    <section id="materials" class="materials-band" aria-labelledby="materials-title"><div class="wrap">
      <div class="materials-head"><h2 id="materials-title">${t('参会资料下载','Meeting documents')}</h2><p>${t('第一轮通知为中英文合订版，附参会意向回执与摘要模板。','The bilingual first announcement includes the attendance intention form and abstract template.')}</p></div>
      <div class="materials-grid">${meetingFiles(v).map(([file,name,format])=>`<a href="${root}downloads/${file}" download>${icon(file.endsWith('.ics')?'calendar':'download')}<b>${name}</b><small>${format}</small></a>`).join('')}
        ${ordered.map(([lang,zh,en])=>`<a href="${root}assets/macao-2027-${lang}.jpg" download>${icon('image')}<b>${t(zh,en)}</b><small>JPG · 1200×630</small></a>`).join('')}</div>
    </div></section>
    <div class="wrap meeting-layout"><aside class="facts-panel" aria-labelledby="glance-title">${label(t('第一轮通知','First announcement'))}<h2 id="glance-title">${t('会议概览','At a glance')}</h2>
      <dl><dt>${t('学术会期','Scientific sessions')}</dt><dd>${t('2027 年 8 月 23 日全天、24 日上午','23 August 2027, full day; 24 August, morning')}</dd><dt>${t('会前安排','Pre-meeting activities')}</dt><dd>${t('8 月 22 日下午 Council Meeting，晚间嘉宾晚宴（拟）','Council Meeting on the afternoon of 22 August; invited-guest dinner planned')}</dd><dt>${t('拟定会场','Proposed venue')}</dt><dd>${t('中国澳门 · 澳门科技大学（具体会场待确认）','Macau University of Science and Technology, Macao, China (rooms to be confirmed)')}</dd><dt>${t('交流形式','Presentation formats')}</dt><dd>${t('大会报告、青年学者论坛、壁报交流','Scientific lectures, Young Scholar Forum and posters')}</dd></dl>
      <div class="facts-contact"><span>${t('大会秘书处','Meeting secretariat')}</span><a href="mailto:${secretariat}?subject=${encodeURIComponent(t('澳门 ASVB 2027 · 参会咨询','ASVB Macao 2027 | Enquiry'))}">${icon('mail')}${secretariat}</a></div>
      <a class="facts-link" href="sponsorship.html">${t('会议赞助与展位合作 →','Sponsorship and exhibition →')}</a></aside>
      <div class="meeting-article"><section id="announcement"><h2>${t('第一轮会议通知','First announcement')}</h2>
        <p>${t('第十二届亚洲血管生物学学会会议拟于 2027 年 8 月 23–24 日在澳门科技大学举办。会议将围绕血管生物学与血管医学的研究进展，通过学术报告、青年学者论坛及壁报交流，促进基础研究、临床研究和医学转化领域的交流与合作。','The 12th Scientific Meeting of the Asian Society for Vascular Biology is planned to be held at Macau University of Science and Technology, Macao, China, on 23–24 August 2027. The meeting will bring together researchers and clinicians to discuss advances in vascular biology and vascular medicine through scientific lectures, a Young Scholar Forum and poster presentations.')}</p>
        <p>${t('诚邀相关领域的专家学者、青年研究人员及研究生参会，分享研究成果，开展学术讨论。','We invite colleagues, early-career researchers and postgraduate students to join the meeting, share their findings and explore opportunities for collaboration in basic, clinical and translational research.')}</p>
        <ol class="steps-inline"><li><b>1</b><span><a href="#materials">${t('下载第一轮通知','Download the announcement')}</a></span></li><li><b>2</b><span><a href="#participate">${t('填写并发送参会意向回执','Complete and email the attendance form')}</a></span></li><li><b>3</b><span><a href="#abstracts">${t('拟投稿者可按模板准备摘要','Preparing an abstract? See the template')}</a></span></li></ol></section>
        <section id="programme"><h2>${t('初步日程','Preliminary programme')}</h2>
          <ol class="schedule">${timetable.map(([day,weekday,title,rows])=>`<li><div class="schedule-date"><b>${day}</b><span>${t('8 月','AUG')}</span></div><div class="schedule-copy"><small>${weekday}</small><h3>${title}</h3><dl>${rows.map(([when,what])=>`<dt>${when}</dt><dd>${what}</dd>`).join('')}</dl></div></li>`).join('')}</ol>
          <p class="note">${t('具体报告时段、分会场、晚宴安排及会场信息待确认，确认后公布。','Session times, parallel sessions, dinner arrangements and rooms are to be confirmed and will be published once confirmed.')}</p></section>
        <section id="participate"><h2>${t('参会意向与注册','Attendance and registration')}</h2><p>${t('有意参会者请填写参会意向回执，发送至大会秘书长邮箱。第一轮回执仅收集参会意向；如需正式邀请函，请在回执中注明。正式注册入口及缴费方式后续公布。','Please complete the attendance intention form and send it to the Conference Secretary-General. This initial form records attendance intentions only; please indicate if you require an official invitation letter. Registration and payment details will follow.')}</p>
          <div class="action-pair">${download(v,'ASVB2027-attendance.docx',t('下载参会意向回执','Download the attendance intention form'))}<a class="btn btn-ink" href="mailto:${secretariat}?subject=${encodeURIComponent(t('澳门 ASVB 2027 · 参会意向回执','ASVB Macao 2027 | Attendance intention form'))}">${icon('mail')}${t('发送回执','Email the form')}</a></div>
          <div class="fee-table"><table><caption>${t('暂定注册费（人民币）','Tentative registration fees (CNY)')}</caption><thead><tr><th scope="col">${t('参会类别','Category')}</th><th scope="col">${t('早鸟注册','Early bird')}</th><th scope="col">${t('常规注册','Regular')}</th></tr></thead><tbody><tr><th scope="row">${t('普通参会者','Regular participants')}</th><td>¥2,500</td><td>¥3,000</td></tr><tr><th scope="row">${t('学生','Students')}</th><td>¥1,500</td><td>¥2,000</td></tr></tbody></table>
            <p class="note">${t('早鸟截止日期暂定为 2027 年 5 月 1 日。注册费原则上适用于所有参会者；具体减免、早鸟截止日适用规则、餐饮及晚宴所含项目、退款办法均待确认，以正式注册通知为准。','The early-bird deadline is tentatively 1 May 2027. All participants are generally required to pay the registration fee. Fee waivers, deadline rules, meal and dinner inclusions, and refunds remain to be confirmed in the formal registration announcement.')}</p></div>
        </section>
        <section id="abstracts"><h2>${t('摘要征集','Call for abstracts')}</h2><p>${t('会议征集血管生物学、血管疾病机制及相关转化研究的摘要，交流形式包括口头报告和壁报。欢迎青年研究人员和研究生投稿并参加青年学者论坛。','We welcome abstracts on vascular biology, mechanisms of vascular disease and related translational research for oral or poster presentation. Early-career researchers and postgraduate students are encouraged to submit abstracts and participate in the Young Scholar Forum.')}</p><p>${t('请按摘要模板列明题目、作者、单位、摘要正文、关键词及通讯作者信息，建议使用英文撰写，并在参会回执中注明申请的交流形式。具体录用及报告安排由组委会另行通知。','Please use the abstract template and include the title, authors, affiliations, abstract text, keywords and corresponding author details. An English abstract is recommended. Indicate your preferred presentation format on the attendance intention form. Acceptance and presentation arrangements will be communicated by the Organizing Committee.')}</p>
          ${download(v,'ASVB2027-abstract.docx',t('下载摘要模板','Download the abstract template'))}
          <p class="note">${t('征稿截止日期和正式提交方式待确认，确认后公布。现阶段可联系大会秘书长咨询或提交参会意向。','The abstract deadline and formal submission instructions remain to be confirmed. Please contact the Conference Secretary-General for enquiries or to express your interest in attending.')}</p></section>
        <section id="travel"><h2>${t('住宿、交通及参会准备','Accommodation and travel')}</h2>
          <ul class="check-list"><li><b>${t('住宿','Accommodation')}</b><span>${t('原则上由参会者自理。推荐酒店及会议优惠价待确认，后续提供。','Participants are generally responsible for their own accommodation. Recommended hotels and conference rates will be provided once confirmed.')}</span></li>
          <li><b>${t('交通与会场','Routes and rooms')}</b><span>${t('交通路线及澳门科技大学内的具体会场待确认，后续提供。','Routes and the specific rooms at Macau University of Science and Technology will be provided once confirmed.')}</span></li>
          <li><b>${t('出行准备','Before you travel')}</b><span>${t('请提前向所在单位核实参会审批和差旅报销要求，并核实本人适用的赴澳门证件和签注要求。','Please check institutional travel approval and reimbursement requirements, as well as the travel documents and entry permissions applicable to Macao.')}</span></li></ul></section>
        <section id="organisation"><h2>${t('组织单位与大会组织','Organization')}</h2><dl class="org-list">
          <dt>${t('拟主办单位','Proposed organizer')}</dt><dd>${c.name}</dd><dt>${t('拟承办单位','Proposed host')}</dt><dd>${t('澳门科技大学','Macau University of Science and Technology')}</dd><dt>${t('拟协办单位','Proposed co-organizers')}</dt><dd>${t('南方科技大学<br>广东省药理学会神经药理专委会','Southern University of Science and Technology<br>Neuropharmacology Committee of the Guangdong Pharmacological Society')}</dd></dl>
          <h3 class="committee-title">${t('大会组织','Conference leadership')}<small>${t('（拟定，待确认）','(proposed, subject to confirmation)')}</small></h3>
          <dl class="committee">
            <div><dt>${t('大会主席','Conference Chairs')}</dt><dd>${t('黄聿 · 卞劲松 · 朱依谆','Yu Huang · Jinsong Bian · Yizhun Zhu')}</dd></div>
            <div><dt>${t('组委会主席','Organizing Committee Chair')}</dt><dd>${t('朱依谆','Yizhun Zhu')}</dd></div>
            <div><dt>${t('学术委员会主席','Academic Committee Chair')}</dt><dd>${t('汪南平','Nanping Wang')}</dd></div>
            <div><dt>${t('大会秘书长','Conference Secretary-General')}</dt><dd>${t('鲁昊骋','Haocheng Lu')}</dd></div>
          </dl>
        </section><section id="contact" class="contact-panel">${label(t('会务联系','Contact'))}<h2>${t('大会秘书处','Meeting secretariat')}</h2><p>${t('大会秘书长／会务联系人：鲁昊骋。参会意向、邀请函及学术交流事宜，请通过以下方式联系。','Conference Secretary-General / Conference Contact: Haocheng Lu. For attendance, invitation letters and programme enquiries, please use the contacts below.')}</p><div class="contact-rows"><a class="mail-link" href="mailto:${secretariat}?subject=${encodeURIComponent(t('澳门 ASVB 2027 · 参会咨询','ASVB Macao 2027 | Enquiry'))}">${icon('mail')}${secretariat}</a><span class="wechat-line">${icon('chat')}${t('微信','WeChat')} · ${wechat}</span></div></section>
        <section id="sponsors" class="sponsor-teaser"><h2>${t('会议赞助与展位合作','Sponsorship and exhibition')}</h2><p>${t('欢迎相关企业及机构联系组委会，洽谈会议赞助和展位合作。赞助方案与展位安排由大会秘书处单独洽谈。','Companies and institutions interested in sponsorship or exhibition opportunities are welcome to contact the Organizing Committee. Sponsorship and exhibition arrangements are discussed individually with the meeting secretariat.')}</p>
          <div class="enquiry-actions"><a class="btn btn-ink" href="${enquiry(v,'sponsor')}">${icon('mail')}${t('咨询会议赞助','Sponsorship enquiry')}</a><a class="btn btn-outline" href="${enquiry(v,'booth')}">${icon('mail')}${t('咨询展位合作','Exhibition enquiry')}</a></div>
          ${cite('sponsorship.html',t('查看赞助招商页','Visit the sponsorship page'))}</section>
        <section id="share" class="share-section"><h2>${t('会议宣传图','Share the meeting')}</h2>
          <p>${t('下载图片即可转发。中文宣传图的二维码指向中文会议页，英文宣传图指向英文会议页。','Download a graphic to share with colleagues. The QR code on each graphic opens this page in the corresponding language.')}</p>
          <div class="share-grid">${ordered.map(([lang,zh,en,qz,qe])=>`<figure><img loading="lazy" width="1200" height="630" src="${root}assets/macao-2027-${lang}.jpg" alt="${lang==='zh'?t('澳门 2027 第十二届 ASVB 学术会议中文宣传图，含拟定会期、会场及二维码','Chinese graphic for Macao 2027 with dates, venue and QR code'):t('澳门 2027 第十二届 ASVB 学术会议英文宣传图，含拟定会期、会场及二维码','English graphic for Macao 2027 with dates, venue and QR code')}"><figcaption><a class="download-row" href="${root}assets/macao-2027-${lang}.jpg" download>${icon('download')}<span>${t('下载'+zh,'Download the '+en)}</span><small>JPG</small></a><small>${t(qz,qe)}</small></figcaption></figure>`).join('')}</div>
          <div class="share-actions"><button class="copy-link" type="button" hidden>${icon('share')}${t('复制会议网址','Copy meeting link')}</button></div>
          <p class="share-status" role="status"></p>
        </section>
      </div></div>
  </main>`;
}
function sponsorship(v) {
  const {t,c,root} = v;
  const previous = records.find(r=>r.id==='singapore-2026');
  const options = [
    { kind:'sponsor', title: t('会议赞助','Meeting sponsorship'),
      detail: t('有意支持本届学术会议的企业和机构，可向大会秘书处介绍合作设想和希望支持的活动，并了解可选的赞助安排。','Tell the secretariat which activities your organization would like to support and what kind of support you have in mind. The secretariat will share the available arrangements.'),
      action: t('咨询会议赞助','Enquire about sponsorship') },
    { kind:'booth', title: t('展位合作','Exhibiting at the meeting'),
      detail: t('希望参展的单位可简要介绍拟展示的产品、技术或服务，并向大会秘书处咨询展位规格、费用和布展时间。','Describe the products, technologies or services you would like to exhibit, and ask the secretariat about stand dimensions, costs and set-up times.'),
      action: t('咨询展位合作','Enquire about exhibiting') }
  ];
  const steps = [
    [t('发送咨询邮件','Send an enquiry'), t('点击上方按钮，邮件主题和正文模板会自动填好，补充单位、联系人和合作设想即可。','Use one of the buttons above. The subject line and a short template are filled in; add your organization, contact details and interests.')],
    [t('秘书处回复','Hear from the secretariat'), t('大会秘书处根据会场确认情况，介绍可选的合作方式、展位安排和时间节点。','The secretariat replies with the available options, exhibition arrangements and timelines as the venue is confirmed.')],
    [t('确认合作','Confirm the arrangements'), t('与大会秘书处确认合作内容、权益、费用及后续办理方式。','Confirm the scope, benefits, costs and next steps with the meeting secretariat.')]
  ];
  return `<main id="main">
    <section class="paper-intro sponsor-intro"><div class="wrap">${breadcrumb(v,c.sponsorship,{href:'macao-2027.html',name:c.next})}
      <div class="sponsor-hero"><div>${label(t('澳门 2027 · 第十二届 ASVB 学术会议','Macao 2027 · 12th ASVB Scientific Meeting'))}
        <h1>${t('赞助招商','Sponsorship and exhibition')}</h1>
        <p class="lead">${t('第十二届亚洲血管生物学学会会议将汇集从事血管基础与临床研究的学者。欢迎有意赞助会议或参展的企业和机构与大会秘书处洽谈。','The 12th Scientific Meeting of the Asian Society for Vascular Biology will bring together vascular biologists and clinical researchers. Companies and institutions interested in sponsoring or exhibiting are welcome to contact the meeting secretariat.')}</p>
        <ul class="sponsor-facts"><li>${icon('calendar')}${t('拟定会期 · 2027 年 8 月 23–24 日','Proposed dates · 23–24 August 2027')}</li><li>${icon('pin')}${t('拟定会场 · 中国澳门 · 澳门科技大学','Proposed venue · Macau University of Science and Technology, Macao')}</li><li>${icon('lectern')}${t('大会报告 · 青年学者论坛 · 壁报交流','Lectures · Young Scholar Forum · Posters')}</li></ul>
        <div class="enquiry-actions"><a class="btn btn-ink" href="${enquiry(v,'sponsor')}">${icon('mail')}${t('咨询会议赞助','Sponsorship enquiry')}</a><a class="btn btn-outline" href="${enquiry(v,'booth')}">${icon('mail')}${t('咨询展位合作','Exhibition enquiry')}</a></div></div>
        <figure class="sponsor-photo"><img width="1640" height="716" src="${root}assets/${previous.image}" alt="${v.value(previous.alt)}"><figcaption><a href="${route(previous.id)}">${t('第十一届 ASVB 学术会议合影 · 新加坡，2026','Delegates at the 11th ASVB Scientific Meeting · Singapore, 2026')}</a></figcaption></figure>
      </div></div></section>
    <div class="wrap sponsor-layout"><div class="sponsor-main">
      <section class="sponsor-options" aria-labelledby="opportunities"><h2 id="opportunities">${t('合作方式','Ways to participate')}</h2>
        ${options.map(o=>`<article><h3>${o.title}</h3><div><p>${o.detail}</p><a class="btn btn-outline btn-small" href="${enquiry(v,o.kind)}">${icon('mail')}${o.action}</a></div></article>`).join('')}
        <p class="notice">${t('本届赞助档位、展位规格、费用及对应权益将在会场与预算确认后由大会秘书处提供。现阶段请通过秘书处单独洽谈。','Sponsorship levels, stand dimensions, costs and benefits for this meeting will be provided by the secretariat once the venue and budget are confirmed. For now, please contact the secretariat directly.')}</p></section>
      <section class="sponsor-steps" aria-labelledby="process"><h2 id="process">${t('洽谈流程','How it works')}</h2>
        <ol>${steps.map(([h,p],i)=>`<li><b>${i+1}</b><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></section>
      <section class="sponsor-audience" aria-labelledby="audience"><h2 id="audience">${t('参会人群','Who attends')}</h2>
        <div class="audience-grid"><div><p>${t('会议面向从事血管生物学与血管医学研究的基础科学家、临床研究者、青年研究人员和研究生，学会会员来自中国大陆、香港、澳门、台湾，以及日本、韩国、新加坡和马来西亚。','The meeting is for basic scientists, clinical researchers, early-career investigators and postgraduate students in vascular biology and medicine. Members of the Society come from mainland China, Hong Kong, Macao and Taiwan, as well as Japan, South Korea, Singapore and Malaysia.')}</p>
          <p>${t('上一届新加坡会议约 200 名参会者在两个会场交流，现场展示壁报 45 份。','At the previous meeting in Singapore, around 200 participants gathered across two venues and 45 posters were presented.')} ${cite(route(previous.id),t('新加坡 2026 回顾','Singapore 2026 recap'))}</p></div>
          <figure><img loading="lazy" width="1280" height="873" src="${root}assets/singapore-meeting-desk.webp" alt="${t('第十一届会议 MD11 报告厅外的会议指引与资料台','Meeting signage and information desk outside the MD11 Auditorium at the 11th meeting')}"><figcaption>${t('第十一届会议会场外资料台 · 新加坡，2026','Information desk at the 11th meeting · Singapore, 2026')}</figcaption></figure></div></section>
    </div>
      <aside id="enquiries" class="sponsor-contact" aria-labelledby="enquiries-title"><h2 id="enquiries-title">${t('大会秘书处','Meeting secretariat')}</h2>
        <p class="sponsor-person"><strong>${t('鲁昊骋','Haocheng Lu')}</strong><span>${t('大会秘书长／会务联系人','Conference Secretary-General / Conference Contact')}</span></p>
        <dl><dt>${t('邮箱','Email')}</dt><dd><a href="mailto:${secretariat}">${secretariat}</a></dd><dt>${t('微信','WeChat')}</dt><dd>${wechat}</dd></dl>
        <div class="contact-actions"><a class="btn btn-ink btn-small" href="${enquiry(v,'sponsor')}">${t('会议赞助','Sponsorship')}</a><a class="btn btn-outline btn-small" href="${enquiry(v,'booth')}">${t('展位合作','Exhibition')}</a></div>
        ${download(v,'ASVB2027-first-announcement.docx',t('下载第一轮通知','Download the first announcement'))}
        <a class="facts-link" href="macao-2027.html">${t('查看澳门 2027 会议信息 →','Macao 2027 meeting details →')}</a>
      </aside></div>
  </main>`;
}
function recordPage(v,r) {
  const {t,value,root}=v;
  const other=records.find(other=>other.id!==r.id);
  return `<main id="main"><section class="archive-intro"><div class="wrap">${breadcrumb(v,v.c.recap)}
    <div class="archive-intro-grid"><div>${label(t('会议回顾','Meeting archive'))}<p class="record-edition">${value(r.edition)}</p><h1>${value(r.city)} <em>${r.year}</em></h1><p class="archive-date">${value(r.date)}</p><p>${value(r.venue)}</p>
      <div class="archive-theme"><span>${value(r.themeLabel)}</span><p>${value(r.theme)}</p>${v.english?'':`<p class="original-theme" lang="en">${r.theme[1]}</p>`}</div></div>
    <figure class="archive-lead-image ${r.id}"><img width="1640" height="${r.year==='2026'?716:1093}" src="${root}assets/${r.image}" alt="${value(r.alt)}"></figure></div>
    </div></section><div class="stats-band"><dl class="wrap stats-grid">${r.numbers.map(([n,term])=>`<div><dt>${value(term)}</dt><dd>${n}</dd></div>`).join('')}</dl></div>
    <section class="wrap editorial-section"><div class="split-intro"><div>${label(t('会后报道','Meeting report'))}<h2>${t('会议回顾','Meeting report')}</h2></div><div class="report-copy"><p class="lead">${value(r.intro)}</p><p>${value(r.host)}</p>
      ${r.forumTheme?`<p class="forum-theme">${t(`同期联合论坛以“${r.forumTheme}”为主题。`,`The joint forum announced its own theme, <span lang="zh-CN">“${r.forumTheme}”</span> (exploring disease mechanisms and protecting vascular health).`)} ${cite(sources.shenzhenNotice,t('联合会议第三轮通知','Joint meeting announcement'))}</p>`:''}
      ${r.sections.map(([heading,body])=>`<h3>${value(heading)}</h3><p>${value(body)}</p>`).join('')}
      <div class="source-links">${cite(sources[r.source],value(r.sourceTitle))}${r.id==='shenzhen-2025'?cite(sources.interview,t('讲者访谈 · Vessel Plus','Speaker interview · Vessel Plus')):''}${cite('sources.html#meeting-themes',t('会议主题出处','Sources for meeting themes'))}</div>
      ${r.id==='singapore-2026'?download(v,'ASVB2026-programme.pdf',t('下载会前日程','Download the pre-meeting programme'),'PDF'):''}
    </div></div></section>
    ${r.gallery?`<section class="gallery-section" aria-labelledby="gallery-title"><div class="wrap"><h2 id="gallery-title">${t('会议现场','At the meeting')}</h2><div class="gallery">${r.gallery.map(([file,w,h,cap,alt])=>`<figure><img loading="lazy" width="${w}" height="${h}" src="${root}assets/${file}" alt="${value(alt)}"><figcaption>${value(cap)}</figcaption></figure>`).join('')}</div></div></section>`:''}
    <div class="archive-cross"><div class="wrap"><a href="index.html#archive">${t('返回历届会议','All past meetings')}</a><a href="${route(other.id)}">${value(other.edition)} · ${value(other.city)} ${other.year}</a></div></div>
  </main>`;
}
function credits(v) {
  const {t}=v;
  return `<main id="main" class="credits-page"><div class="wrap">${breadcrumb(v,v.c.resources)}${label(t('出处与署名','Sources & credits'))}<h1>${v.c.resources}</h1>
    <div class="credits-grid"><section><h2>${t('会议信息','Meeting sources')}</h2>
      <p>${t('澳门会议内容依据《第十二届亚洲血管生物学学会会议第一轮通知》中英文修订稿。会期、场地及费用按第一轮通知的拟定状态列示。学会宗旨依据 2026 年修订的 ASVB 章程。','The Macao pages follow the bilingual first announcement for the 12th Scientific Meeting. Dates, venue and fees are presented as proposed. The description of the Society follows its by-laws revised in 2026.')}</p>
      <ul class="source-list"><li>${cite(sources.firstMeeting,t('首届会议通知 · Acta Pharmacologica Sinica','Inaugural meeting announcement · Acta Pharmacologica Sinica'))}</li><li>${cite(sources.shanghai,t('第八届会议通知 · 上海交通大学医学院','Eighth meeting notice · Shanghai Jiao Tong University School of Medicine'))}</li><li>${cite(sources.shenzhen,t('第十届会后报道 · 广东省药理学会','10th meeting report · Guangdong Pharmacological Society'))}</li><li>${cite(sources.interview,t('深圳会议讲者访谈 · Vessel Plus','Shenzhen speaker interview · Vessel Plus'))}</li><li>${cite(sources.singapore,t('第十一届会后报道 · 南方科技大学','11th meeting report · Southern University of Science and Technology'))}</li></ul>
      <h3 id="meeting-themes">${t('历届会议主题出处','Sources for meeting themes')}</h3>
      <p>${t('深圳第十届 ASVB 学术会议的英文主题见卞劲松主席 2026 年 6 月 12 日工作报告第 2 节。本站附中文译文。同期联合论坛的中文主题见南方科技大学医学院发布的第三轮通知。','The English theme for the 10th ASVB meeting in Shenzhen appears in section 2 of President Jinsong Bian’s report of 12 June 2026. This site provides a Chinese translation. The SUSTech School of Medicine’s third announcement gives the Chinese theme of the joint forum.')} ${cite(sources.shenzhenNotice,t('深圳联合会议第三轮通知','Shenzhen joint meeting announcement'))}</p>
      <p>${t('新加坡第十一届会议的英文主题见印刷版会议手册第 2 页主席欢迎辞，中文采用南方科技大学会后报道的原文。','The President’s welcome on page 2 of the printed Singapore programme gives the English theme. The Chinese wording follows the meeting report published by Southern University of Science and Technology.')} ${cite(sources.singapore,t('新加坡会后报道','Singapore meeting report'))}</p></section>
      <section><h2>${t('影像与图版','Photography and illustration')}</h2><h3>${t('澳门塔夜景','Macao Tower at night')}</h3><p>${t('网站首页使用提供给 ASVB 网站的澳门塔夜景照片。','The home page features a night photograph of Macao Tower supplied to the ASVB website.')}</p>
      <h3>${t('澳门南湾湖','Nam Van Lake, Macao')}</h3><p>${t('Diego Delso 摄于 2013 年。澳门会议页与宣传图采用裁切、缩放后的照片，改编图像沿用 CC BY-SA 3.0 许可。','Photograph by Diego Delso, 2013. The Macao meeting page and meeting graphics feature cropped and resized versions of the photograph. The adaptations are available under CC BY-SA 3.0.')} <a href="${sources.city}">${t('原作','Original')}</a> · <a href="${sources.artist}">delso.photo</a> · <a href="${sources.cityLicense}">${t('许可','Licence')}</a></p>
      <h3>${t('主动脉弓及其分支','The aortic arch and its branches')}</h3><p>H. V. Carter, <i>Gray’s Anatomy</i>, 1918, fig. 505. ${t('公有领域。','Public domain.')} <a href="${sources.plate}">${t('原书图版','Original plate')}</a> · <a href="${sources.plateLicense}">${t('公版说明','Rights information')}</a></p>
      <h3>${t('会议合影与会标','Meeting photographs and emblem')}</h3><p>${t('新加坡大会合影及会场照片（主会场报告、青年学者论坛、会场外资料台）、深圳 ASVB 专场合影与学会会标来自 ASVB 会务资料。两届会后报道亦收录了对应现场影像。','The Singapore group photograph and on-site photographs (main session, Young Scholar Forum and meeting desk), the Shenzhen photograph and the Society emblem are from the ASVB meeting archives. The respective post-meeting reports also document these gatherings.')}</p>
      <h3>${t('网页字体','Typefaces')}</h3><p>Instrument Serif · Noto Serif SC. <a href="${v.root}assets/LICENSE-InstrumentSerif.txt">Instrument Serif OFL</a> · <a href="${v.root}assets/LICENSE-NotoSerifSC.txt">Noto Serif SC OFL</a></p></section></div></div></main>`;
}
const pages = {
  index: [home, ['学会与学术会议','Society and scientific meetings']],
  society: [society, ['学会介绍与会议沿革','About the Society']],
  'macao-2027': [meeting, ['第十二届会议 · 澳门 2027','12th Scientific Meeting · Macao 2027']],
  sponsorship: [sponsorship, ['赞助招商 · 澳门 2027','Sponsorship and exhibition · Macao 2027']],
  ...Object.fromEntries(records.map(r=>[r.id, [v=>recordPage(v,r), [r.edition[0]+' · '+r.city[0]+' '+r.year,r.edition[1]+' · '+r.city[1]+' '+r.year]]])),
  sources: [credits, ['资料与图片','Sources and credits']]
};
const escapeAttribute = (text) => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function pageMetadata(v, title) {
  const {page,t,value} = v;
  const record = records.find(r=>r.id===page);
  const isMacao = page==='index' || page==='macao-2027' || page==='sponsorship';
  const description = record ? `${value(record.edition)} · ${value(record.city)} ${record.year} · ${value(record.theme)}` : {
    index: t('亚洲血管生物学学会、澳门 2027 学术会议通知，以及深圳和新加坡会议回顾。','The Asian Society for Vascular Biology, the Macao 2027 meeting announcement, and reports from Shenzhen and Singapore.'),
    'macao-2027': t('第十二届 ASVB 学术会议拟于 2027 年 8 月 23–24 日在澳门科技大学举行。查看第一轮通知、拟定日程、参会回执及摘要模板。','The 12th ASVB meeting is planned for 23–24 August 2027 at Macau University of Science and Technology. Find the first announcement, programme, attendance form and abstract template.'),
    sponsorship: t('联系 ASVB 大会秘书处，洽谈澳门 2027 第十二届学术会议的会议赞助和展位合作。','Contact the ASVB meeting secretariat about sponsorship and exhibiting at the 12th Scientific Meeting in Macao in 2027.'),
    society: t('亚洲血管生物学学会的宗旨、学术交流与自 2005 年起的会议沿革。','The aims of the Asian Society for Vascular Biology and its scientific meetings since 2005.'),
    sources: t('ASVB 学术会议的文献出处、原始通知、摄影与图版署名。','Original announcements, sources for ASVB meeting themes, and photography and illustration credits.')
  }[page];
  const path = isMacao ? meetingGraphic(v) : (record ? `assets/${record.image}` : 'assets/society-logo.png');
  const alt = isMacao ? t('澳门 2027 · 第十二届 ASVB 学术会议','Macao 2027 · 12th ASVB Scientific Meeting')
    : record ? value(record.alt) : v.c.name;
  return `<meta name="description" content="${escapeAttribute(description)}">
<link rel="canonical" href="${publicPage(v.lang,page)}">
<link rel="alternate" hreflang="zh-CN" href="${publicPage('zh',page)}"><link rel="alternate" hreflang="en" href="${publicPage('en',page)}"><link rel="alternate" hreflang="x-default" href="${publicPage('zh',page)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Asian Society for Vascular Biology"><meta property="og:locale" content="${v.english?'en_GB':'zh_CN'}">
<meta property="og:title" content="${escapeAttribute(title)}"><meta property="og:description" content="${escapeAttribute(description)}"><meta property="og:url" content="${publicPage(v.lang,page)}">
<meta property="og:image" content="${publicBase+path}"><meta property="og:image:alt" content="${escapeAttribute(alt)}">${isMacao?'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">':''}
<meta name="twitter:card" content="${isMacao||record?'summary_large_image':'summary'}">`;
}
for (const lang of ['zh','en']) {
  const dir = lang === 'en' ? join(output,'en') : output;
  mkdirSync(dir,{recursive:true});
  for (const [page,[render,pageTitle]] of Object.entries(pages)) {
    const v=context(lang,page), title=`${v.value(pageTitle)} | ASVB`, currentLang=v.english?'en':'zh-CN';
    const html=`<!doctype html>
<html lang="${currentLang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeAttribute(title)}</title>${pageMetadata(v,title)}<meta name="theme-color" content="#102a42">
<link rel="icon" type="image/png" href="${v.root}assets/society-logo.png">
<link rel="stylesheet" href="${v.root}site.css"><script src="${v.root}site.js" defer></script>
</head><body class="page-${page}">${header(v)}${render(v)}${footer(v)}</body></html>`;
    const clean = html.split('\n').map(line => line.trimEnd()).join('\n');
    writeFileSync(join(dir,route(page)),clean+'\n');
  }
}
const calendar=[
  'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ASVB//Scientific Meetings//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
  'BEGIN:VEVENT','UID:asvb-12-scientific-20270823@asvb.com.cn','DTSTAMP:20261120T000000Z','DTSTART;VALUE=DATE:20270823','DTEND;VALUE=DATE:20270825','STATUS:TENTATIVE','TRANSP:TRANSPARENT',
  'SUMMARY:12th ASVB Scientific Meeting (proposed)','LOCATION:Macau University of Science and Technology\\, Macao\\, China',
  'DESCRIPTION:Scientific sessions on 23 August and the morning of 24 August.','  Proposed venue and dates. See the first announcement.','END:VEVENT','END:VCALENDAR',''
];
mkdirSync(join(output,'downloads'),{recursive:true});
writeFileSync(join(output,'downloads','ASVB2027-Macao.ics'),calendar.join('\r\n'));
