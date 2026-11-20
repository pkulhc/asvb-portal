import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources, records, history, secretariat } from './content.mjs';

const output = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const copy = {
  zh: { name: '亚洲血管生物学学会', home: '首页', society: '学会介绍', next: '澳门 2027', archive: '历届会议', contact: '参会咨询', resources: '资料与图片', menu: '导航菜单', skip: '跳到正文', recap: '会议回顾', detail: '阅读会后报道' },
  en: { name: 'Asian Society for Vascular Biology', home: 'Home', society: 'Society', next: 'Macao 2027', archive: 'Past meetings', contact: 'Meeting enquiries', resources: 'Sources & credits', menu: 'Navigation menu', skip: 'Skip to content', recap: 'Meeting archive', detail: 'Read the meeting report' }
};
const icons = {
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4m9-4v4M4 10h16m-12 4h2m4 0h2"/>',
  pin: '<path d="M19.5 10c0 5.4-7.5 11-7.5 11S4.5 15.4 4.5 10a7.5 7.5 0 1 1 15 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  lectern: '<path d="M3 4h18v11H3zM7 21l5-6 5 6M12 4V2m-5 9 3-3 2.8 2 3.7-3"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  book: '<path d="M3 4.5c3.2-.7 6.2-.3 9 1.6 2.8-1.9 5.8-2.3 9-1.6v14c-3.6-.7-6.4-.2-9 1.6-2.6-1.8-5.4-2.3-9-1.6ZM12 6v14"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>'
};
const icon = (key) => `<svg class="icon" aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</svg>`;
const label = (text) => `<p class="eyebrow"><span></span>${text}</p>`;
const cite = (href, name) => `<a class="text-link" href="${href}">${name}</a>`;
const titleTheme = ['血管健康与疾病发生：机制与转化前沿探索', 'Vascular Health and Disease Pathogenesis: Exploring Mechanistic and Translational Frontiers'];
const route = (id) => `${id}.html`;
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
    [c.archive, v.archive, records.some(r => r.id === page)]
  ];
  return `<a class="skip" href="#main">${c.skip}</a>
    <header class="masthead" id="top"><div class="wrap header-inner">
      <a class="brand" href="index.html" aria-label="${c.name} · ${c.home}">
        <img width="55" height="55" src="${root}assets/society-logo.png" alt="">
        <span class="brand-lockup"><b>ASVB</b><span>${c.name}</span></span>
      </a>
      <div class="header-tools">
        <nav class="site-nav" id="site-nav" aria-label="${v.t('网站导航','Site navigation')}">
          ${tabs.map(([name,href,active])=>`<a href="${href}"${active?' class="is-current" aria-current="'+(page==='index'||page==='society'||page==='macao-2027'?'page':'location')+'"':''}>${name}</a>`).join('')}
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
    <nav aria-label="${t('页脚导航','Footer navigation')}"><a href="society.html">${c.society}</a><a href="macao-2027.html">${c.next}</a><a href="${v.archive}">${c.archive}</a></nav>
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
    <p>${v.value(r.note)}</p></a>`;
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
  return `<main id="main">
    <section class="hero">
      <img class="hero-image" width="1920" height="899" fetchpriority="high" src="${root}assets/macao-waterfront.webp" alt="">
      <div class="hero-shade"></div><div class="wrap hero-inner">
        <div class="hero-copy">${label('12TH SCIENTIFIC MEETING')}
          <h1>${t('澳门','Macao')} <em>2027</em></h1>
          <p class="hero-meeting">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p>
          <p class="hero-theme">${v.value(titleTheme)}</p>
          <div class="hero-actions"><a class="btn btn-gold" href="macao-2027.html">${t('查看第一轮通知','First announcement')}</a><a class="btn btn-glass" href="macao-2027.html#programme">${t('浏览拟定日程','Explore the programme')}</a></div>
        </div>
        ${cityCredit(v)}
      </div>
    </section>
    ${infoStrip(v)}
    <section id="society" class="society-section"><div class="wrap society-grid">
      <div class="society-copy">${label('THE SOCIETY')}<h2>${t('亚洲血管生物学学会','Asian Society for<br>Vascular Biology')}</h2>
        <p class="body-copy">${t('2005 年，首届 ASVB 学术会议在上海举行。学会汇聚亚太地区研究血管的基础科学家、临床研究者和青年学者，共同探讨血管功能、疾病机制与医学转化。','Since its first scientific meeting in Shanghai in 2005, ASVB has brought together basic scientists, clinicians and early-career researchers from across the Asia-Pacific to study vascular function and disease.')}</p>
        ${cite('society.html',t('了解学会与沿革','About the Society and its history'))}
      </div>${plate(v)}
    </div></section>
    <section id="archive" class="archive-section"><div class="wrap">
      <div class="section-heading">${label('MEETING ARCHIVE')}<h2>${c.archive}</h2></div>
      <div class="record-grid">${records.map(r=>archiveCard(v,r)).join('')}</div>
    </div></section>
  </main>`;
}
function breadcrumb(v,name) {
  return `<nav class="crumb" aria-label="${v.t('当前位置','Breadcrumb')}"><a href="index.html">${v.c.home}</a><span aria-hidden="true">/</span><span aria-current="page">${name}</span></nav>`;
}
function society(v) {
  const { t } = v;
  return `<main id="main">
    <section class="paper-intro"><div class="wrap">${breadcrumb(v,v.c.society)}
      <div class="society-grid"><div>${label('THE SOCIETY')}<h1>${v.c.name}</h1>
        <p class="lead">${t('ASVB 推动亚洲血管生物学与血管医学的研究、教育和学术交流，让大学、研究机构和医院的研究者在同一场会议上讨论共同的问题。','ASVB advances research, education and scientific exchange in vascular biology and medicine in Asia. Its meetings bring researchers from universities, institutes and hospitals into the same conversation.')}</p></div>${plate(v)}</div></div>
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
    ['22',t('周日','Sunday'),t('会前活动','Pre-meeting activities'),t('下午举行理事会。晚间拟安排受邀嘉宾晚宴。','Council Meeting in the afternoon. An invited-guest dinner is planned for the evening.')],
    ['23',t('周一','Monday'),t('学术会议 · 全天','Scientific sessions · full day'),t('大会报告、青年学者论坛和壁报交流。晚间拟安排大会晚宴。','Scientific lectures, the Young Scholar Forum and posters. A conference dinner is planned for the evening.')],
    ['24',t('周二','Tuesday'),t('学术会议 · 上午','Scientific sessions · morning'),t('学术报告及闭幕。','Scientific presentations and the closing session.')]
  ];
  const nav=[['programme',t('初步日程','Programme')],['participate',t('参会意向','Attendance')],['abstracts',t('摘要征集','Abstracts')],['organisation',t('组织单位','Organizers')],['contact',t('会务联系','Contact')]];
  return `<main id="main">
    <section class="meeting-banner"><img src="${v.root}assets/macao-waterfront.webp" class="hero-image" width="1920" height="899" alt="" fetchpriority="high"><div class="hero-shade"></div><div class="wrap">
      ${breadcrumb(v,c.next)}${label('12TH SCIENTIFIC MEETING')}<h1>${t('澳门','Macao')} <em>2027</em></h1>
      <p class="feature-title">${t('第十二届亚洲血管生物学学会会议','The 12th Scientific Meeting of the Asian Society for Vascular Biology')}</p><p>${v.value(titleTheme)}</p>
      ${cityCredit(v)}</div></section>
    <nav class="section-nav" aria-label="${t('会议页面目录','On this page')}"><div class="wrap">${nav.map(([id,name])=>`<a href="#${id}">${name}</a>`).join('')}</div></nav>
    <div class="wrap meeting-layout"><aside class="facts-panel">${label(t('第一轮通知','FIRST ANNOUNCEMENT'))}<h2>${t('会议概览','At a glance')}</h2>
      <dl><dt>${t('学术会期（拟）','Planned scientific sessions')}</dt><dd>${t('2027 年 8 月 23–24 日','23–24 August 2027')}</dd><dt>${t('拟定会场','Proposed venue')}</dt><dd>${t('中国澳门 · 澳门科技大学','Macau University of Science and Technology, Macao, China')}</dd><dt>${t('交流形式','Presentation formats')}</dt><dd>${t('大会报告、青年学者论坛、壁报交流','Scientific lectures, Young Scholar Forum and posters')}</dd></dl>
      ${download(v,'ASVB2027-Macao.ics',t('加入日历','Add to calendar'),'ICS')}</aside>
      <div class="meeting-article"><section><h2>${t('第一轮会议通知','First announcement')}</h2>
        <p>${t('本届会议拟于 2027 年 8 月 23–24 日在澳门科技大学举行。欢迎基础与临床研究人员、青年学者及研究生分享血管生物学、血管疾病发生机制与转化研究的新进展。','The 12th meeting is planned for 23–24 August 2027 at Macau University of Science and Technology. Basic scientists, clinicians, early-career investigators and postgraduate students are invited to share new work on vascular biology, disease mechanisms and translational research.')}</p></section>
        <section id="programme"><h2>${t('初步日程','Preliminary programme')}</h2><p>${t('8 月 22 日为会前活动。具体报告时段、会场和晚宴安排待组委会确认。','Pre-meeting activities take place on 22 August. Session times, rooms and dinner arrangements are to be confirmed.')}</p>
          <ol class="schedule">${timetable.map(([day,weekday,title,detail])=>`<li><div class="schedule-date"><b>${day}</b><span>AUG</span></div><div class="schedule-copy"><small>${weekday}</small><h3>${title}</h3><p>${detail}</p></div></li>`).join('')}</ol></section>
        <section id="participate"><h2>${t('参会意向与注册','Attendance and registration')}</h2><p>${t('请下载参会意向回执，填写后发送至大会秘书处。如需正式邀请函，可在回执中注明。正式注册入口、缴费及退款办法将在后续通知中公布。','Download the attendance form and email your completed copy to the meeting secretariat. Indicate on the form if you need an invitation letter. Formal registration, payment and refund details will follow.')}</p>
          ${download(v,'ASVB2027-attendance.docx',t('下载参会意向回执','Download the attendance form'))}
          <p class="email-line">${t('回执邮箱','Send completed forms to')} <a href="mailto:${secretariat}?subject=ASVB%202027%20attendance%20intention">${secretariat}</a></p>
          <details class="disclosure"><summary>${t('暂定注册费（人民币）','Tentative registration fees (CNY)')}</summary><div>
            <table><caption>${t('第十二届会议暂定收费','Provisional fees for the 12th meeting')}</caption><thead><tr><th scope="col">${t('参会类别','Category')}</th><th scope="col">${t('早鸟','Early bird')}</th><th scope="col">${t('常规','Standard')}</th></tr></thead><tbody><tr><th scope="row">${t('普通参会者','Regular delegate')}</th><td>¥2,500</td><td>¥3,000</td></tr><tr><th scope="row">${t('学生','Student')}</th><td>¥1,500</td><td>¥2,000</td></tr></tbody></table>
            <p>${t('早鸟截止日期暂定为 2027 年 5 月 1 日，适用规则及费用包含项目以正式注册通知为准。','The proposed early-bird deadline is 1 May 2027. Eligibility and fee inclusions will be set out in the formal registration announcement.')}</p></div></details>
        </section>
        <section id="abstracts"><h2>${t('摘要征集','Call for abstracts')}</h2><p>${t('征集方向包括血管生物学、血管疾病机制及相关转化研究。可申请口头报告或壁报，欢迎青年研究人员和研究生参加青年学者论坛。','Abstracts are invited on vascular biology, mechanisms of vascular disease and related translational research. Authors may request an oral or poster presentation. Early-career researchers and postgraduate students are encouraged to take part in the Young Scholar Forum.')}</p><p>${t('建议用英文撰写，列明题目、作者、单位、摘要正文、关键词及通讯作者信息。请在参会回执中注明交流形式。正式提交方式和截稿日期另行公布。','An abstract in English is recommended. Include the title, authors, affiliations, abstract, keywords and corresponding author details. Indicate your preferred format on the attendance form. The submission channel and deadline will be announced separately.')}</p>
          ${download(v,'ASVB2027-abstract.docx',t('下载摘要模板','Download the abstract template'))}</section>
        <section id="organisation"><h2>${t('拟定组织单位','Proposed organizers')}</h2><dl class="org-list">
          <dt>${t('主办','Organizer')}</dt><dd>${c.name}</dd><dt>${t('承办','Host')}</dt><dd>${t('澳门科技大学','Macau University of Science and Technology')}</dd><dt>${t('协办','Co-organizers')}</dt><dd>${t('南方科技大学、广东省药理学会神经药理专委会','Southern University of Science and Technology and the Neuropharmacology Committee of the Guangdong Pharmacological Society')}</dd></dl>
        </section><section id="contact" class="contact-panel">${label(t('会务联系','CONTACT'))}<h2>${t('大会秘书处','Meeting secretariat')}</h2><p>${t('参会意向、邀请函及学术交流事宜，请联系大会秘书长鲁昊骋。','For attendance, invitation letters and programme enquiries, contact Conference Secretary-General Haocheng Lu.')}</p><a class="mail-link" href="mailto:${secretariat}?subject=ASVB%202027%20enquiry">${icon('mail')}${secretariat}</a></section>
      </div></div>
  </main>`;
}
function recordPage(v,r) {
  const {t,value,root}=v;
  const other=records.find(other=>other.id!==r.id);
  return `<main id="main"><section class="archive-intro"><div class="wrap">${breadcrumb(v,v.c.recap)}
    <div class="archive-intro-grid"><div>${label('MEETING ARCHIVE')}<p class="record-edition">${value(r.edition)}</p><h1>${value(r.city)} <em>${r.year}</em></h1><p class="archive-date">${value(r.date)}</p><p>${value(r.venue)}</p></div>
    <figure class="archive-lead-image ${r.id}"><img width="1640" height="${r.year==='2026'?716:1093}" src="${root}assets/${r.image}" alt="${value(r.alt)}"></figure></div>
    </div></section><div class="stats-band"><dl class="wrap stats-grid">${r.numbers.map(([n,term])=>`<div><dt>${value(term)}</dt><dd>${n}</dd></div>`).join('')}</dl></div>
    <section class="wrap editorial-section"><div class="split-intro"><div>${label('MEETING REPORT')}<h2>${t('会议回顾','Meeting report')}</h2></div><div class="report-copy"><p class="lead">${value(r.intro)}</p><p>${value(r.host)}</p>
      ${r.sections.map(([heading,body])=>`<h3>${value(heading)}</h3><p>${value(body)}</p>`).join('')}
      <div class="source-links">${cite(sources[r.source],value(r.sourceTitle))}${r.id==='shenzhen-2025'?cite(sources.interview,t('讲者访谈 · Vessel Plus','Speaker interview · Vessel Plus')):''}</div>
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
      <ul class="source-list"><li>${cite(sources.firstMeeting,t('首届会议通知 · Acta Pharmacologica Sinica','Inaugural meeting announcement · Acta Pharmacologica Sinica'))}</li><li>${cite(sources.shanghai,t('第八届会议通知 · 上海交通大学医学院','Eighth meeting notice · Shanghai Jiao Tong University School of Medicine'))}</li><li>${cite(sources.shenzhen,t('第十届会后报道 · 广东省药理学会','10th meeting report · Guangdong Pharmacological Society'))}</li><li>${cite(sources.interview,t('深圳会议讲者访谈 · Vessel Plus','Shenzhen speaker interview · Vessel Plus'))}</li><li>${cite(sources.singapore,t('第十一届会后报道 · 南方科技大学','11th meeting report · Southern University of Science and Technology'))}</li></ul></section>
      <section><h2>${t('影像与图版','Photography and illustration')}</h2><h3>${t('澳门南湾湖','Nam Van Lake, Macao')}</h3><p>${t('Diego Delso 摄于 2013 年。网站图片经缩放并转换为 WebP，沿用 CC BY-SA 3.0 许可。','Photograph by Diego Delso, 2013. The resized WebP version is distributed under the same CC BY-SA 3.0 licence.')} <a href="${sources.city}">${t('原作','Original')}</a> · <a href="${sources.artist}">delso.photo</a> · <a href="${sources.cityLicense}">${t('许可','Licence')}</a></p>
      <h3>${t('主动脉弓及其分支','The aortic arch and its branches')}</h3><p>H. V. Carter, <i>Gray’s Anatomy</i>, 1918, fig. 505. ${t('公有领域。','Public domain.')} <a href="${sources.plate}">${t('原书图版','Original plate')}</a> · <a href="${sources.plateLicense}">${t('公版说明','Rights information')}</a></p>
      <h3>${t('会议合影与会标','Meeting photographs and emblem')}</h3><p>${t('新加坡大会合影、深圳 ASVB 专场合影与学会会标来自 ASVB 会务资料。两届会后报道亦收录了对应现场影像。','The Singapore and Shenzhen photographs and the Society emblem are from the ASVB meeting archives. The respective post-meeting reports also document these gatherings.')}</p>
      <h3>${t('网页字体','Typefaces')}</h3><p>Instrument Serif · Noto Serif SC. <a href="${v.root}assets/LICENSE-InstrumentSerif.txt">Instrument Serif OFL</a> · <a href="${v.root}assets/LICENSE-NotoSerifSC.txt">Noto Serif SC OFL</a></p></section></div></div></main>`;
}
const pages = {
  index: [home, ['学会与学术会议','Society and scientific meetings']],
  society: [society, ['学会介绍与会议沿革','About the Society']],
  'macao-2027': [meeting, ['第十二届会议 · 澳门 2027','12th Scientific Meeting · Macao 2027']],
  ...Object.fromEntries(records.map(r=>[r.id, [v=>recordPage(v,r), [r.edition[0]+' · '+r.city[0]+' '+r.year,r.edition[1]+' · '+r.city[1]+' '+r.year]]])),
  sources: [credits, ['资料与图片','Sources and credits']]
};
for (const lang of ['zh','en']) {
  const dir = lang === 'en' ? join(output,'en') : output;
  mkdirSync(dir,{recursive:true});
  for (const [page,[render,pageTitle]] of Object.entries(pages)) {
    const v=context(lang,page), title=`${v.value(pageTitle)} | ASVB`, currentLang=v.english?'en':'zh-CN';
    const description=page==='index'||page==='macao-2027'
      ? v.t('亚洲血管生物学学会及历届学术会议。第十二届会议拟于 2027 年 8 月 23–24 日在中国澳门举行。','The Asian Society for Vascular Biology and its scientific meetings. The 12th meeting is planned for 23–24 August 2027 in Macao, China.')
      : `${v.value(pageTitle)} · ${v.c.name}`;
    const html=`<!doctype html>
<html lang="${currentLang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#102a42">
<link rel="icon" type="image/png" href="${v.root}assets/society-logo.png">
<link rel="alternate" hreflang="zh-CN" href="${v.english?'../':''}${route(page)}"><link rel="alternate" hreflang="en" href="${v.english?'':'en/'}${route(page)}">
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
