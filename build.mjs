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
  const { c, t } = v;
  return `<footer class="footer"><div class="wrap">
    <div class="footer-main"><div><a href="index.html" class="footer-mark">ASVB</a><p>${c.name}</p></div>
    <nav aria-label="${t('页脚导航','Footer navigation')}"><a href="society.html">${c.society}</a><a href="macao-2027.html">${c.next}</a><a href="${v.archive}">${c.archive}</a><a href="sponsorship.html">${c.sponsorship}</a></nav>
    <div class="footer-contact"><span>${t('大会秘书处','Meeting secretariat')}</span><a href="mailto:${secretariat}">${secretariat}</a></div></div>
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
    <div class="record-heading"><div><span class="record-edition">${v.value(r.edition)}</span><h3>${v.value(r.city)} <em>${r.year}</em></h3></div><span class="record-link">${v.t('回顾','Recap')}</span></div>
    <p class="record-theme"><small>${v.value(r.themeLabel)}</small>${v.value(r.theme)}</p></a>`;
}
function infoStrip(v) {
  const { t } = v;
  const items = [
    ['calendar',t('拟定学术会期','Planned scientific sessions'),t('<span class="date-part">2027年</span><wbr><span class="date-part">8月23–24日</span>','23–24 August 2027')],
    ['pin',t('拟定会场','Proposed venue'),t('澳门科技大学','Macau University of Science and Technology')],
    ['lectern',t('学术交流形式','Scientific programme'),t('大会报告 · 青年论坛 · 壁报','Lectures · Young Scholar Forum · Posters')]
  ];
  return `<section class="info-band" aria-label="${t('第十二届会议速览','12th meeting at a glance')}"><div class="wrap info-grid">
    ${items.map(([sym,term,def])=>`<div class="info-item">${icon(sym)}<dl><dt>${term}</dt><dd>${def}</dd></dl></div>`).join('')}</div></section>`;
}
function home(v) {
  const { t, root, c } = v;
  const forms = [
    ['ASVB2027-first-announcement.docx', t('第一轮通知','First announcement')],
    ['ASVB2027-attendance.docx', t('参会意向回执','Attendance form')],
    ['ASVB2027-abstract.docx', t('摘要模板','Abstract template')]
  ];
  return `<main id="main">
    <section class="hero home-hero">
      <img class="hero-image" width="1917" height="1279" fetchpriority="high" src="${root}assets/macao-tower-night.jpg" alt="">
      <div class="hero-shade"></div><div class="wrap hero-inner">
        <div class="hero-copy">${label('12TH SCIENTIFIC MEETING')}
          <h1>${t('澳门','Macao')} <em>2027</em></h1>
          <p class="hero-meeting">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p>
          <p class="hero-theme">${v.value(titleTheme)}</p>
          <div class="hero-actions"><a class="btn btn-gold" href="macao-2027.html">${t('查看第一轮通知','First announcement')}</a><a class="btn btn-glass" href="macao-2027.html#programme">${t('浏览拟定日程','Explore the programme')}</a></div>
        </div>
        <div class="city-credit"><span>${icon('pin')}${t('中国澳门 · 澳门塔','Macao Tower · Macao, China')}</span></div>
      </div>
    </section>
    ${infoStrip(v)}
    <section class="resource-band" aria-labelledby="resource-title"><div class="wrap">
      <h2 id="resource-title">${t('澳门参会资料','Macao meeting resources')}</h2>
      <div class="resource-links">${forms.map(([file,name])=>`<a href="${root}downloads/${file}" download>${icon('download')}${name}</a>`).join('')}<a href="macao-2027.html#share">${icon('share')}${t('会议宣传图','Meeting graphic')}</a></div>
    </div></section>
    <section id="society" class="society-section"><div class="wrap society-grid">
      <div class="society-copy">${label('THE SOCIETY')}<h2>${t('亚洲血管生物学学会','Asian Society for<br>Vascular Biology')}</h2>
        <p class="body-copy">${t('2005 年，首届 ASVB 学术会议在上海举行。学会汇聚亚太地区研究血管的基础科学家、临床研究者和青年学者，共同探讨血管功能、疾病机制与医学转化。','Since its first scientific meeting in Shanghai in 2005, ASVB has brought together basic scientists, clinicians and early-career researchers from across the Asia-Pacific to study vascular function and disease.')}</p>
        <p class="body-copy">${v.value(membership)}</p>
        ${cite('society.html',t('了解学会与沿革','About the Society and its history'))}
      </div>${plate(v)}
    </div></section>
    <section id="archive" class="archive-section"><div class="wrap">
      <div class="section-heading">${label('MEETING ARCHIVE')}<h2>${c.archive}</h2></div>
      <div class="record-grid">${records.map(r=>archiveCard(v,r)).join('')}</div>
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
      <div class="society-grid"><div>${label('THE SOCIETY')}<h1>${v.c.name}</h1>
        <p class="lead">${t('ASVB 推动亚洲血管生物学与血管医学的研究、教育和学术交流，让大学、研究机构和医院的研究者在同一场会议上讨论共同的问题。','ASVB advances research, education and scientific exchange in vascular biology and medicine in Asia. Its meetings bring researchers from universities, institutes and hospitals into the same conversation.')}</p>
        <p class="body-copy">${v.value(membership)}</p></div>${plate(v)}</div></div>
    </section>
    <section class="wrap editorial-section"><div class="split-intro">${label('SCIENTIFIC EXCHANGE')}<div><h2>${t('学会的工作','The work of the Society')}</h2>
      <p>${t('在学术会议上，基础科学家讨论血管内皮、平滑肌与周围组织如何调控血管功能，临床研究者带来疾病机制和治疗中的问题。纪念讲座、专题报告和壁报让这些问题在不同学科之间展开。','Scientific sessions connect work on the endothelium, vascular muscle and surrounding tissues with clinical questions about mechanisms and treatment. Named lectures, focused talks and posters give members several ways to discuss their findings.')}</p>
      <p>${t('学会也支持血管生物学教学和继续教育。青年学者论坛为研究生和青年研究人员提供口头展示与同行讨论的机会。','The Society supports the teaching of vascular biology and continuing education for scientists and physicians. The Young Scholar Forum gives postgraduate students and early-career investigators a place to present and discuss their research.')}</p></div></div></section>
    <section class="history-section"><div class="wrap split-intro"><div>${label('MEETING HISTORY')}<h2>${t('会议沿革','Meeting history')}</h2></div>
      <ol class="timeline">${history.map(([year,place,summary,id])=>`<li><em>${year}</em><div><h3>${id?`<a href="${route(id)}">${v.value(place)}</a>`:v.value(place)}</h3><p>${v.value(summary)}</p></div></li>`).join('')}</ol>
    </div></section>
  </main>`;
}
function download(v, file, name, format='DOCX') {
  return `<a class="download-row" href="${v.root}downloads/${file}" download>${icon('download')}<span>${name}</span><small>${format}</small></a>`;
}
function meeting(v) {
  const { t,c }=v;
  const timetable=[
    ['22',t('周日','Sunday'),t('会前活动','Pre-meeting activities'),t('下午举行 Council Meeting。晚间拟安排受邀嘉宾晚宴，地点待确认。','Council Meeting in the afternoon. An invited-guest dinner is planned for the evening; venue to be confirmed.')],
    ['23',t('周一','Monday'),t('学术会议 · 全天','Scientific sessions · full day'),t('大会报告、青年学者论坛和壁报交流。晚间拟安排全体参会人员晚宴，地点及参加规则待确认。','Scientific lectures, the Young Scholar Forum and posters. A conference dinner for all participants is planned; venue and attendance arrangements to be confirmed.')],
    ['24',t('周二','Tuesday'),t('学术会议 · 上午','Scientific sessions · morning'),t('学术报告及闭幕。','Scientific presentations and the closing session.')]
  ];
  const nav=[['programme',t('初步日程','Programme')],['participate',t('参会意向','Attendance')],['abstracts',t('摘要征集','Abstracts')],['travel',t('住宿交通','Travel')],['organisation',t('组织单位','Organizers')],['contact',t('会务联系','Contact')],['share',t('宣传图','Share')]];
  return `<main id="main">
    <section class="meeting-banner"><img src="${v.root}assets/macao-waterfront.webp" class="hero-image" width="1920" height="899" alt="" fetchpriority="high"><div class="hero-shade"></div><div class="wrap">
      ${breadcrumb(v,c.next)}${label('12TH SCIENTIFIC MEETING')}<h1>${t('澳门','Macao')} <em>2027</em></h1>
      <p class="feature-title">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p><p>${v.value(titleTheme)}</p>
      ${cityCredit(v)}</div></section>
    <nav class="section-nav" aria-label="${t('会议页面目录','On this page')}"><div class="wrap">${nav.map(([id,name])=>`<a href="#${id}">${name}</a>`).join('')}</div></nav>
    <div class="wrap meeting-layout"><aside class="facts-panel">${label(t('第一轮通知','FIRST ANNOUNCEMENT'))}<h2>${t('会议概览','At a glance')}</h2>
      <dl><dt>${t('学术会期','Scientific sessions')}</dt><dd>${t('2027 年 8 月 23 日全天、24 日上午','23 August 2027, full day; 24 August, morning')}</dd><dt>${t('会前安排','Pre-meeting activities')}</dt><dd>${t('8 月 22 日下午 Council Meeting，晚间嘉宾晚宴（拟）','Council Meeting on the afternoon of 22 August; invited-guest dinner planned')}</dd><dt>${t('拟定会场','Proposed venue')}</dt><dd>${t('中国澳门 · 澳门科技大学（具体会场待确认）','Macau University of Science and Technology, Macao, China (rooms to be confirmed)')}</dd><dt>${t('交流形式','Presentation formats')}</dt><dd>${t('大会报告、青年学者论坛、壁报交流','Scientific lectures, Young Scholar Forum and posters')}</dd></dl>
      <div class="facts-downloads">${download(v,'ASVB2027-first-announcement.docx',t('下载第一轮通知 · 中英文','Download the first announcement · bilingual'))}${download(v,'ASVB2027-Macao.ics',t('加入日历','Add to calendar'),'ICS')}</div></aside>
      <div class="meeting-article"><section><h2>${t('第一轮会议通知','First announcement')}</h2>
        <p>${t('本届会议拟于 2027 年 8 月 23–24 日在澳门科技大学举行。欢迎基础与临床研究人员、青年学者及研究生分享血管生物学、血管疾病发生机制与转化研究的新进展。','The 12th meeting is planned for 23–24 August 2027 at Macau University of Science and Technology. Basic scientists, clinicians, early-career investigators and postgraduate students are invited to share new work on vascular biology, disease mechanisms and translational research.')}</p></section>
        <section id="programme"><h2>${t('初步日程','Preliminary programme')}</h2><p>${t('8 月 22 日为会前活动。具体报告时段、分会场、晚宴安排及会场信息待确认，确认后公布。','Pre-meeting activities take place on 22 August. Session times, parallel sessions, dinner arrangements and rooms will be published once confirmed.')}</p>
          <ol class="schedule">${timetable.map(([day,weekday,title,detail])=>`<li><div class="schedule-date"><b>${day}</b><span>AUG</span></div><div class="schedule-copy"><small>${weekday}</small><h3>${title}</h3><p>${detail}</p></div></li>`).join('')}</ol></section>
        <section id="participate"><h2>${t('参会意向与注册','Attendance and registration')}</h2><p>${t('请下载参会意向回执，填写后发送至大会秘书长邮箱。第一轮回执仅收集参会意向；如需正式邀请函，请在回执中注明。正式注册入口及缴费方式后续公布。','Download the attendance intention form and email the completed copy to the Conference Secretary-General. This initial form records attendance intentions only; indicate if you require an official invitation letter. Registration and payment details will follow.')}</p>
          ${download(v,'ASVB2027-attendance.docx',t('下载参会意向回执','Download the attendance intention form'))}
          <p class="email-line">${t('回执邮箱','Send completed forms to')} <a href="mailto:${secretariat}?subject=ASVB%202027%20attendance%20intention">${secretariat}</a></p>
          <details class="disclosure"><summary>${t('暂定注册费（人民币）','Tentative registration fees (CNY)')}</summary><div>
            <table><caption>${t('第十二届会议暂定收费','Provisional fees for the 12th meeting')}</caption><thead><tr><th scope="col">${t('参会类别','Category')}</th><th scope="col">${t('早鸟','Early bird')}</th><th scope="col">${t('常规','Standard')}</th></tr></thead><tbody><tr><th scope="row">${t('普通参会者','Regular delegate')}</th><td>¥2,500</td><td>¥3,000</td></tr><tr><th scope="row">${t('学生','Student')}</th><td>¥1,500</td><td>¥2,000</td></tr></tbody></table>
            <p>${t('早鸟截止日期暂定为 2027 年 5 月 1 日。注册费原则上适用于所有参会者；具体减免、早鸟截止日适用规则、餐饮及晚宴所含项目、退款办法均待确认，以正式注册通知为准。','The early-bird deadline is tentatively 1 May 2027. All participants are generally required to pay the registration fee. Fee waivers, deadline rules, meal and dinner inclusions, and refunds remain to be confirmed in the formal registration announcement.')}</p></div></details>
        </section>
        <section id="abstracts"><h2>${t('摘要征集','Call for abstracts')}</h2><p>${t('征集方向包括血管生物学、血管疾病机制及相关转化研究，交流形式包括口头报告和壁报。欢迎青年研究人员和研究生投稿并参加青年学者论坛。','Abstracts are invited on vascular biology, mechanisms of vascular disease and related translational research for oral or poster presentation. Early-career researchers and postgraduate students are encouraged to submit abstracts and participate in the Young Scholar Forum.')}</p><p>${t('请按摘要模板列明题目、作者、单位、摘要正文、关键词及通讯作者信息，并在参会回执中注明申请的交流形式。具体录用及报告安排由组委会另行通知；征稿截止日期和正式提交方式待确认后公布。','Please use the abstract template and include the title, authors, affiliations, abstract text, keywords and corresponding author details. Indicate your preferred presentation format on the attendance intention form. Acceptance and presentation arrangements will be communicated by the Organizing Committee. The abstract deadline and formal submission instructions will be published once confirmed.')}</p>
          ${download(v,'ASVB2027-abstract.docx',t('下载摘要模板','Download the abstract template'))}</section>
        <section id="travel"><h2>${t('住宿、交通及参会准备','Accommodation and travel')}</h2><p>${t('住宿原则上由参会者自理。推荐酒店、会议优惠价、交通路线及具体会场待确认后提供。','Participants are generally responsible for their own accommodation costs. Recommended hotels, conference rates, routes and room details will be provided once confirmed.')}</p><p>${t('请提前向所在单位核实参会审批和差旅报销要求，并核实本人适用的赴澳门证件和签注要求。','Please check institutional travel approval and reimbursement requirements, as well as the travel documents and entry permissions applicable to Macao.')}</p></section>
        <section id="organisation"><h2>${t('组织单位与大会组织','Organization')}</h2><dl class="org-list">
          <dt>${t('拟主办单位','Proposed organizer')}</dt><dd>${c.name}</dd><dt>${t('拟承办单位','Proposed host')}</dt><dd>${t('澳门科技大学','Macau University of Science and Technology')}</dd><dt>${t('拟协办单位','Proposed co-organizers')}</dt><dd>${t('南方科技大学<br>广东省药理学会神经药理专委会','Southern University of Science and Technology<br>Neuropharmacology Committee of the Guangdong Pharmacological Society')}</dd></dl>
          <h3 class="committee-title">${t('大会组织','Conference leadership')}<small>${t('（拟定，待确认）','(proposed, subject to confirmation)')}</small></h3>
          <dl class="committee">
            <div><dt>${t('大会主席','Conference Chairs')}</dt><dd>${t('黄聿 · 卞劲松 · 朱依谆','Yu Huang · Jinsong Bian · Yizhun Zhu')}</dd></div>
            <div><dt>${t('组委会主席','Organizing Committee Chair')}</dt><dd>${t('朱依谆','Yizhun Zhu')}</dd></div>
            <div><dt>${t('学术委员会主席','Academic Committee Chair')}</dt><dd>${t('汪南平','Nanping Wang')}</dd></div>
            <div><dt>${t('大会秘书长','Conference Secretary-General')}</dt><dd>${t('鲁昊骋','Haocheng Lu')}</dd></div>
          </dl>
        </section><section id="contact" class="contact-panel">${label(t('会务联系','CONTACT'))}<h2>${t('大会秘书处','Meeting secretariat')}</h2><p>${t('大会秘书长／会务联系人：鲁昊骋。参会意向、邀请函及学术交流事宜，请通过以下邮箱联系。','Conference Secretary-General / Conference Contact: Haocheng Lu. For attendance, invitation letters and programme enquiries, please use the email below.')}</p><div class="contact-rows"><a class="mail-link" href="mailto:${secretariat}?subject=ASVB%202027%20enquiry">${icon('mail')}${secretariat}</a><span class="wechat-line">${icon('chat')}${t('微信','WeChat')} · ${wechat}</span></div><p class="partner-invitation">${t('欢迎相关企业及机构洽谈会议赞助与展位合作。','Companies and institutions are welcome to discuss sponsorship and exhibition opportunities.')} ${cite('sponsorship.html',t('查看赞助招商','Sponsorship and exhibition enquiries'))}</p></section>
        <section id="share" class="share-section"><h2>${t('会议宣传图','Share the meeting')}</h2>
          <p>${t('下载图片即可转发。图中的二维码直达本页，方便同行查看澳门会议通知。','Download the graphic to share with colleagues. Its QR code links directly to this announcement.')}</p>
          <figure><img loading="lazy" width="1200" height="630" src="${v.root}${meetingGraphic(v)}" alt="${t('澳门 2027 第十二届 ASVB 学术会议宣传图，含拟定会期、会场及会议网址二维码','Macao 2027 meeting graphic with the planned dates, venue and a QR code linking to this page')}"></figure>
          <div class="share-actions"><a class="download-row" href="${v.root}${meetingGraphic(v)}" download>${icon('download')}<span>${t('下载中文宣传图','Download English graphic')}</span><small>JPG</small></a><button class="copy-link" type="button" hidden>${icon('share')}${t('复制会议网址','Copy meeting link')}</button></div>
          <p class="share-status" role="status"></p>
        </section>
      </div></div>
  </main>`;
}
function sponsorship(v) {
  const {t,c} = v;
  const previous = records.find(r=>r.id==='singapore-2026');
  const options = [
    {
      title: t('会议赞助','Meeting sponsorship'),
      detail: t('有意支持本届学术会议的企业和机构，可向组委会介绍合作设想、希望支持的活动，以及需要了解的赞助安排。','If your organization would like to support the scientific meeting, tell the committee which activities interest you and what kind of support you have in mind.'),
      action: t('咨询会议赞助','Enquire about sponsorship'),
      prompt: t('我们希望支持的活动或合作设想是……','We are interested in supporting…')
    },
    {
      title: t('展位合作','Exhibiting at the meeting'),
      detail: t('希望参展的单位可简要介绍拟展示的产品、技术或服务，并向组委会咨询展位规格、费用和布展时间。','Tell the committee about the products, technologies or services you would like to exhibit. You can also ask about stand dimensions, costs and set-up times.'),
      action: t('咨询展位合作','Enquire about exhibiting'),
      prompt: t('我们拟展示的产品、技术或服务是……','We would like to exhibit…')
    }
  ];
  function enquiry(option) {
    const subject = t(`澳门 ASVB 2027 · ${option.title}`,`ASVB Macao 2027 | ${option.title}`);
    const body = t(
      `组委会老师，您好！\r\n\r\n我是[单位名称]的[姓名]。${option.prompt}\r\n\r\n欢迎通过[邮箱或电话]与我联系。`,
      `Dear Organizing Committee,\r\n\r\nMy name is [name] and I represent [organization]. ${option.prompt}\r\n\r\nYou can reach me at [email or phone].`
    );
    return `mailto:${secretariat}?subject=${encodeURIComponent(subject)}&amp;body=${encodeURIComponent(body)}`;
  }
  return `<main id="main">
    <section class="paper-intro sponsor-intro"><div class="wrap">${breadcrumb(v,c.sponsorship,{href:'macao-2027.html',name:c.next})}
      <div class="sponsor-hero"><div>${label(t('澳门 2027 · 第十二届 ASVB 学术会议','MACAO 2027 · 12TH ASVB SCIENTIFIC MEETING'))}
        <h1>${t('赞助招商','Sponsorship and exhibition')}</h1>
        <p class="lead">${t('第十二届亚洲血管生物学学会会议将汇集从事血管基础与临床研究的学者。欢迎有意赞助会议或参展的企业和机构与组委会洽谈。','The 12th Scientific Meeting of the Asian Society for Vascular Biology will bring together vascular biologists and clinical researchers. We invite companies and institutions to sponsor the meeting or exhibit in Macao.')}</p>
        <ul class="sponsor-facts"><li>${icon('calendar')}${t('拟定会期 · 2027 年 8 月 23–24 日','Proposed dates · 23–24 August 2027')}</li><li>${icon('pin')}${t('拟定会场 · 澳门科技大学','Proposed venue · Macau University of Science and Technology')}</li></ul>
        <a class="btn sponsor-button" href="#enquiries">${icon('mail')}${t('联系大会秘书处','Contact the secretariat')}</a></div>
        <figure class="sponsor-photo"><img width="1640" height="716" src="${v.root}assets/${previous.image}" alt="${v.value(previous.alt)}"><figcaption><a href="${route(previous.id)}">${t('第十一届 ASVB 学术会议合影 · 新加坡，2026','Delegates at the 11th ASVB Scientific Meeting · Singapore, 2026')}</a></figcaption></figure>
      </div></div></section>
    <div class="wrap sponsor-layout"><section class="sponsor-options" aria-labelledby="opportunities"><h2 id="opportunities">${t('合作方式','Ways to participate')}</h2>
      ${options.map(option=>`<article><h3>${option.title}</h3><div><p>${option.detail}</p>${cite(enquiry(option),option.action)}</div></article>`).join('')}</section>
      <aside id="enquiries" class="sponsor-contact" aria-labelledby="enquiries-title"><h2 id="enquiries-title">${t('招商联系','Partnership enquiries')}</h2>
        <p class="sponsor-person"><strong>${t('鲁昊骋','Haocheng Lu')}</strong><span>${t('大会秘书长','Conference Secretary-General')}</span></p>
        <dl><dt>${t('邮箱','Email')}</dt><dd><a href="mailto:${secretariat}">${secretariat}</a></dd><dt>${t('微信','WeChat')}</dt><dd>${wechat}</dd></dl>
        ${download(v,'ASVB2027-first-announcement.docx',t('下载第一轮通知','Download the first announcement'))}
      </aside></div>
  </main>`;
}
function recordPage(v,r) {
  const {t,value,root}=v;
  const other=records.find(other=>other.id!==r.id);
  return `<main id="main"><section class="archive-intro"><div class="wrap">${breadcrumb(v,v.c.recap)}
    <div class="archive-intro-grid"><div>${label('MEETING ARCHIVE')}<p class="record-edition">${value(r.edition)}</p><h1>${value(r.city)} <em>${r.year}</em></h1><p class="archive-date">${value(r.date)}</p><p>${value(r.venue)}</p>
      <div class="archive-theme"><span>${value(r.themeLabel)}</span><p>${value(r.theme)}</p>${v.english?'':`<p class="original-theme" lang="en">${r.theme[1]}</p>`}</div></div>
    <figure class="archive-lead-image ${r.id}"><img width="1640" height="${r.year==='2026'?716:1093}" src="${root}assets/${r.image}" alt="${value(r.alt)}"></figure></div>
    </div></section><div class="stats-band"><dl class="wrap stats-grid">${r.numbers.map(([n,term])=>`<div><dt>${value(term)}</dt><dd>${n}</dd></div>`).join('')}</dl></div>
    <section class="wrap editorial-section"><div class="split-intro"><div>${label('MEETING REPORT')}<h2>${t('会议回顾','Meeting report')}</h2></div><div class="report-copy"><p class="lead">${value(r.intro)}</p><p>${value(r.host)}</p>
      ${r.forumTheme?`<p class="forum-theme">${t(`同期联合论坛以“${r.forumTheme}”为主题。`,`The joint forum announced its own theme, <span lang="zh-CN">“${r.forumTheme}”</span> (exploring disease mechanisms and protecting vascular health).`)} ${cite(sources.shenzhenNotice,t('联合会议第三轮通知','Joint meeting announcement'))}</p>`:''}
      ${r.sections.map(([heading,body])=>`<h3>${value(heading)}</h3><p>${value(body)}</p>`).join('')}
      <div class="source-links">${cite(sources[r.source],value(r.sourceTitle))}${r.id==='shenzhen-2025'?cite(sources.interview,t('讲者访谈 · Vessel Plus','Speaker interview · Vessel Plus')):''}${cite('sources.html#meeting-themes',t('会议主题出处','Sources for meeting themes'))}</div>
      ${r.id==='singapore-2026'?download(v,'ASVB2026-programme.pdf',t('下载会前日程','Download the pre-meeting programme'),'PDF'):''}
    </div></div></section>
    <div class="archive-cross"><div class="wrap"><a href="index.html#archive">${t('返回历届会议','All past meetings')}</a><a href="${route(other.id)}">${value(other.edition)} · ${value(other.city)} ${other.year}</a></div></div>
  </main>`;
}
function credits(v) {
  const {t}=v;
  return `<main id="main" class="credits-page"><div class="wrap">${breadcrumb(v,v.c.resources)}${label('SOURCES & CREDITS')}<h1>${v.c.resources}</h1>
    <div class="credits-grid"><section><h2>${t('会议信息','Meeting sources')}</h2>
      <p>${t('澳门会议内容依据《第十二届亚洲血管生物学学会会议第一轮通知》中英文修订稿。会期、场地及费用按第一轮通知的拟定状态列示。学会宗旨依据 2026 年修订的 ASVB 章程。','The Macao pages follow the bilingual first announcement for the 12th Scientific Meeting. Dates, venue and fees are presented as proposed. The description of the Society follows its by-laws revised in 2026.')}</p>
      <ul class="source-list"><li>${cite(sources.firstMeeting,t('首届会议通知 · Acta Pharmacologica Sinica','Inaugural meeting announcement · Acta Pharmacologica Sinica'))}</li><li>${cite(sources.shanghai,t('第八届会议通知 · 上海交通大学医学院','Eighth meeting notice · Shanghai Jiao Tong University School of Medicine'))}</li><li>${cite(sources.shenzhen,t('第十届会后报道 · 广东省药理学会','10th meeting report · Guangdong Pharmacological Society'))}</li><li>${cite(sources.interview,t('深圳会议讲者访谈 · Vessel Plus','Shenzhen speaker interview · Vessel Plus'))}</li><li>${cite(sources.singapore,t('第十一届会后报道 · 南方科技大学','11th meeting report · Southern University of Science and Technology'))}</li></ul>
      <h3 id="meeting-themes">${t('历届会议主题出处','Sources for meeting themes')}</h3>
      <p>${t('深圳第十届 ASVB 学术会议的英文主题见卞劲松主席 2026 年 6 月 12 日工作报告第 2 节。本站附中文译文。同期联合论坛的中文主题见南方科技大学医学院发布的第三轮通知。','The English theme for the 10th ASVB meeting in Shenzhen appears in section 2 of President Jinsong Bian’s report of 12 June 2026. This site provides a Chinese translation. The SUSTech School of Medicine’s third announcement gives the Chinese theme of the joint forum.')} ${cite(sources.shenzhenNotice,t('深圳联合会议第三轮通知','Shenzhen joint meeting announcement'))}</p>
      <p>${t('新加坡第十一届会议的英文主题见印刷版会议手册第 2 页主席欢迎辞，中文采用南方科技大学会后报道的原文。','The President’s welcome on page 2 of the printed Singapore programme gives the English theme. The Chinese wording follows the meeting report published by Southern University of Science and Technology.')} ${cite(sources.singapore,t('新加坡会后报道','Singapore meeting report'))}</p></section>
      <section><h2>${t('影像与图版','Photography and illustration')}</h2><h3>${t('澳门塔夜景','Macao Tower at night')}</h3><p>${t('网站首页使用提供给 ASVB 网站的澳门塔夜景照片。','The home page features a night photograph of Macao Tower supplied to the ASVB website.')}</p>
      <h3>${t('澳门南湾湖','Nam Van Lake, Macao')}</h3><p>${t('Diego Delso 摄于 2013 年。澳门会议页与宣传图采用裁切、缩放后的照片，改编图像沿用 CC BY-SA 3.0 许可。','Photograph by Diego Delso, 2013. The Macao meeting page and meeting graphics feature cropped and resized versions of the photograph. The adaptations are available under CC BY-SA 3.0.')} <a href="${sources.city}">${t('原作','Original')}</a> · <a href="${sources.artist}">delso.photo</a> · <a href="${sources.cityLicense}">${t('许可','Licence')}</a></p>
      <h3>${t('主动脉弓及其分支','The aortic arch and its branches')}</h3><p>H. V. Carter, <i>Gray’s Anatomy</i>, 1918, fig. 505. ${t('公有领域。','Public domain.')} <a href="${sources.plate}">${t('原书图版','Original plate')}</a> · <a href="${sources.plateLicense}">${t('公版说明','Rights information')}</a></p>
      <h3>${t('会议合影与会标','Meeting photographs and emblem')}</h3><p>${t('新加坡大会合影、深圳 ASVB 专场合影与学会会标来自 ASVB 会务资料。两届会后报道亦收录了对应现场影像。','The Singapore and Shenzhen photographs and the Society emblem are from the ASVB meeting archives. The respective post-meeting reports also document these gatherings.')}</p>
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
