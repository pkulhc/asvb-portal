export const sources = {
  firstMeeting: 'https://www.chinaphar.com/announcement/view/104',
  huangProfile: 'https://www.cuhk.edu.hk/proj/HuangLab/profile.html',
  wangProfile: 'https://medgs.xjtu.edu.cn/info/1253/6328.htm',
  hualien: 'https://www.conf.tw/site/page.aspx?lang=en&pid=901&sid=1096',
  xian: 'https://pubmed.ncbi.nlm.nih.gov/23676334/',
  kualaLumpur: 'https://hub.hku.hk/handle/10722/226384',
  nanjing: 'https://www.cityu.edu.hk/bms/broadcast/news/20241226-yh-lecture.htm',
  shanghai: 'https://www.shsmu.edu.cn/news/info/1011/15228.htm',
  shenzhen: 'https://www.gdsta.cn/xhzc/ykxh/gdsylxh/xhdt110/content_47634',
  shenzhenNotice: 'https://mp.weixin.qq.com/s/y9G50P5hjH9jaP32kPW_BA',
  interview: 'https://www.oaepublish.com/interviews/vp.348',
  singapore: 'https://newshub.sustech.edu.cn/html/202606/47678.html',
  city: 'https://commons.wikimedia.org/wiki/File:Lago_Nam_Van,_Macao,_2013-08-08,_DD_04.jpg',
  artist: 'https://delso.photo/',
  cityLicense: 'https://creativecommons.org/licenses/by-sa/3.0/',
  plate: 'https://archive.org/details/anatomyofhumanbo1918gray/page/546/mode/1up',
  plateLicense: 'https://commons.wikimedia.org/wiki/File:Gray505.png#Licensing'
};

export const secretariat = 'pharmc@sustech.edu.cn';
export const wechat = 'luhaocheng002';
export const membership = [
  '学会会员来自中国大陆、香港、澳门和台湾，以及日本、韩国、新加坡和马来西亚。',
  'The Society’s members come from mainland China, Hong Kong, Macao and Taiwan, as well as Japan, South Korea, Singapore and Malaysia.'
];

export const mission = [
  ['推动血管生物学与血管医学研究', 'Advance vascular biology and medicine',
    '促进亚洲血管生物学与血管医学的发展，坚持高标准的研究、教育与学术交流。',
    'Advance vascular biology and medicine in Asia and uphold high standards in research, education and scientific exchange.'],
  ['支持教学与继续教育', 'Support teaching and continuing education',
    '推动大学与研究机构开展血管生物学研究和教学，参与面向血管生物学研究者与临床医师的继续教育。',
    'Foster research and teaching in universities and research institutes and support continuing education for vascular researchers and practising physicians.'],
  ['促进学术交流与合作', 'Connect researchers and clinicians',
    '通过学术会议、青年学者论坛和壁报交流，帮助基础研究者、临床医师和青年学者分享成果、建立合作。',
    'Bring basic scientists, clinicians and early-career researchers together through scientific meetings, the Young Scholar Forum and poster sessions.'],
  ['提供专业咨询', 'Provide scientific advice',
    '应教育机构、政府部门及其他机构请求，按学会程序就相关专业问题提供咨询。',
    'Advise educational institutions, government agencies and other organizations on relevant scientific matters when requested and as authorized by the Society.']
];

const leaders = {
  vanhoutte: ['Paul M. Vanhoutte', 'Paul M. Vanhoutte'],
  huang: ['黄聿', 'Yu Huang'],
  wang: ['汪南平', 'Nanping Wang'],
  bian: ['卞劲松', 'Jinsong Bian'],
  chiu: ['裘正健', 'Jeng-Jiann Chiu'],
  susan: ['梁慧心', 'Susan W.S. Leung'],
  george: ['梁栢行', 'George P.H. Leung'],
  lu: ['鲁昊骋', 'Haocheng Lu']
};

export const officers = [
  [['主席','President'], leaders.bian, ['南方科技大学','Southern University of Science and Technology']],
  [['荣誉主席','Honorary President'], leaders.huang, ['香港城市大学','City University of Hong Kong']],
  [['秘书长','Secretary-General'], leaders.susan, ['香港大学','The University of Hong Kong']],
  [['副秘书长','Deputy Secretary-General'], leaders.lu, ['南方科技大学','Southern University of Science and Technology']],
  [['司库','Treasurer'], leaders.george, ['香港大学','The University of Hong Kong']]
];

export const presidents = [
  [['创会时期','Founding years'], leaders.vanhoutte, ['创会主席，2005 年首届学术会议时在任。','Founding President, in office at the first scientific meeting in 2005.'], 'nanjing'],
  [['2010–2018','2010–2018'], leaders.huang, ['曾任创会秘书长，2010 年接任主席。','Previously the founding Secretary-General, he became President in 2010.'], 'huangProfile'],
  [['2018–2025','2018–2025'], leaders.wang, ['2018 年上海会员大会当选，2025 年深圳换届前仍任主席。','Elected in Shanghai in 2018 and chaired the 2025 General Assembly in Shenzhen before the leadership transition.'], 'nanjing'],
  [['2025–2027','2025–2027'], leaders.bian, ['2025 年深圳会员大会确认本届任职。','The 2025 General Assembly in Shenzhen endorsed his appointment for the current term.'], 'singapore']
];

export const secretariesGeneral = [
  [['2005–2010','2005–2010'], leaders.huang, ['创会秘书长。','Founding Secretary-General.'], 'huangProfile'],
  [['2018 年前曾任','Served before 2018'], leaders.wang, ['西安交通大学履历记载曾任此职，任期起止待考。','His Xi’an Jiaotong University profile records his service in this role. Exact dates remain to be verified.'], 'wangProfile'],
  [['2018 年当选','Elected in 2018'], leaders.chiu, ['上海会员大会确认的任期为 2018–2020 年，实际卸任时间待考。','The Shanghai General Assembly approved a 2018–2020 term. His exact departure date remains to be verified.']],
  [['2025–2027','2025–2027'], leaders.susan, ['2025 年深圳会员大会确认本届任职，2026 年新加坡会议纪要继续列为秘书长。','Endorsed for the 2025–2027 term in Shenzhen and listed as Secretary-General in the 2026 Singapore minutes.']]
];

export const council = {
  members: [
    'Kenneth Kun-Yu Wu', leaders.wang[1], leaders.chiu[1], 'Masato Tsutsui', 'Ji-Ho Park',
    'Yulong He', 'Maik Gollasch', 'Injune Kim', 'Dharmani Devi Murugan', 'Alex F. Chen',
    'Roger S.Y. Foo', 'Yibin Wang', 'Pilhan Kim', 'Christine Cheung', 'Dongjun Lee'
  ],
  coOpted: [
    'Kimio Satoh', 'Min Xia', 'Jack W.T. Wong', 'Yi Shi', 'Chia-Ching Wu', 'Wai San Cheang',
    'Li Wang', 'Lei Xiao', 'Liping Xie', 'Tingting Zhang', 'Xiaoyu Tian', 'Suowen Xu', 'Yahan Liu', 'Shanshan Luo'
  ],
  archives: [
    {
      title: ['2025 年深圳会员大会名单','2025 General Assembly, Shenzhen'],
      members: ['Hiroaki Shimokawa', 'Kenneth Kun-Yu Wu', leaders.george[1], leaders.huang[1], leaders.wang[1],
        leaders.bian[1], 'Mohammad Rais Mustafa', leaders.chiu[1], 'Takeshi Adachi', 'Zuyi Yuan',
        'Masato Tsutsui', 'Erdan Dong', 'Ji-Ho Park', 'Yulong He', 'Maik Gollasch', leaders.susan[1],
        'Injune Kim', 'Dharmani Devi Murugan', 'You Mie Lee', 'Alex F. Chen'],
      coOpted: ['Kimio Satoh', 'Min Xia', 'Jack W.T. Wong', 'Yi Shi', 'Chia-Ching Wu',
        'Wai San Cheang', leaders.lu[1], 'Li Wang', 'Lei Xiao', 'Liping Xie', 'Tingting Zhang']
    },
    {
      title: ['2018 年上海会员大会名单','2018 General Assembly, Shanghai'],
      members: [leaders.vanhoutte[1], leaders.huang[1], 'Hiroaki Shimokawa', leaders.wang[1], leaders.george[1],
        'Kenneth Kun-Yu Wu', leaders.bian[1], leaders.chiu[1], 'Mohammad Rais Mustafa', 'Zuyi Yuan',
        'Masato Tsutsui', 'Erdan Dong', 'Ji-Ho Park', 'Yulong He'],
      coOpted: ['Kimio Satoh', 'Min Xia', 'Jack W.T. Wong', 'Dharmani Devi Murugan', 'Yi Shi', 'Chia-Ching Wu']
    }
  ]
};

export const records = [
  {
    id: 'singapore-2026',
    year: '2026',
    city: ['新加坡', 'Singapore'],
    edition: ['第十一届学术会议', '11th Scientific Meeting'],
    date: ['2026 年 6 月 11–14 日', '11–14 June 2026'],
    venue: ['新加坡国立大学', 'National University of Singapore'],
    image: 'singapore-meeting.webp',
    alt: ['第十一届 ASVB 与会者在新加坡国立大学阶梯报告厅合影', 'Delegates of the 11th ASVB meeting in the tiered auditorium at the National University of Singapore'],
    themeLabel: ['会议主题', 'Meeting theme'],
    theme: ['创新·精准·协作——共筑血管生物学未来', 'Innovation, Precision, Collaboration: Shaping the Future of Vascular Biology'],
    intro: ['从内皮功能与血管重构，到代谢调控与转化治疗，研究者在新加坡国立大学讨论不同疾病背后的共同机制。', 'At the National University of Singapore, researchers explored how changes in the endothelium, vessel wall and metabolic environment contribute to vascular disease.'],
    host: ['ASVB 主办，新加坡国立大学承办，南方科技大学协办。大会主会场设在 MD11 报告厅。', 'ASVB convened the meeting, hosted by the National University of Singapore with Southern University of Science and Technology as co-organizer. The main sessions took place in the MD11 Auditorium.'],
    sections: [
      [['纪念讲座', 'Memorial lecture'], ['汪南平教授应邀作 Paul M. Vanhoutte 纪念讲座，致敬这位血管生物学先驱。', 'Nanping Wang delivered the Paul M. Vanhoutte Memorial Lecture, honouring the scientist whose work shaped modern vascular biology.']],
      [['青年学者论坛', 'Young Scholar Forum'], ['青年研究人员通过口头报告讨论疾病模型、实验方法和转化研究，壁报展示将交流延伸到会间。', 'Early-career researchers presented disease models, experimental approaches and translational work in a dedicated oral forum. Poster sessions continued the discussions between lectures.']],
      [['亚太学术交流', 'Exchange across Asia'], ['日本血管生物学与医学组织和韩国血管生物学与医学学会的学者参与大会报告。约 200 名参会者在两个会场交流。', 'Speakers included representatives of the Japanese and Korean vascular biology and medicine societies. Around 200 participants gathered across two meeting venues.']]
    ],
    numbers: [['31', ['主会场特邀报告', 'Invited main-session talks']], ['9', ['青年口头报告', 'Young investigator talks']], ['45', ['现场展示壁报', 'Posters presented']]],
    gallery: [
      ['singapore-session.webp', 1280, 720, ['主会场学术报告', 'Main-session lecture'], ['讲者在 MD11 报告厅介绍血管炎症消退相关研究', 'A speaker presents research on the resolution of vascular inflammation in the MD11 Auditorium']],
      ['singapore-young-forum.webp', 1280, 883, ['青年学者论坛', 'Young Scholar Forum'], ['青年研究者在分会场作口头报告', 'An early-career researcher gives an oral presentation in the Young Scholar Forum']],
      ['singapore-meeting-desk.webp', 1280, 873, ['会场指引与资料台', 'Meeting desk and signage'], ['MD11 报告厅外的会议指引易拉宝与资料台', 'Meeting signage and information desk outside the MD11 Auditorium']]
    ],
    source: 'singapore',
    sourceTitle: ['南方科技大学会后报道', 'Southern University of Science and Technology report']
  },
  {
    id: 'shenzhen-2025',
    year: '2025',
    city: ['深圳', 'Shenzhen'],
    edition: ['第十届学术会议', '10th Scientific Meeting'],
    date: ['2025 年 4 月 11–13 日', '11–13 April 2025'],
    venue: ['中国深圳', 'Shenzhen, China'],
    image: 'shenzhen-meeting.webp',
    alt: ['深圳第十届 ASVB 专场与会者在蓝色大会屏幕前合影', 'Participants in the 10th ASVB scientific meeting in front of the conference screen in Shenzhen'],
    themeLabel: ['ASVB 学术会议主题（中译）', 'ASVB meeting theme'],
    theme: ['血管生物学的创新与挑战', 'Innovations and Challenges in Vascular Biology'],
    forumTheme: '探讨疾病机制，护佑血管健康',
    intro: ['第十届 ASVB 会议与第二届血管稳态与疾病研究前沿论坛在深圳联合举行，聚焦血管如何维持稳态，以及稳态失衡如何参与疾病发生。', 'The 10th ASVB meeting took place in Shenzhen alongside the 2nd Conference on Vascular Homeostasis and Diseases. The joint programme examined how vessels maintain homeostasis and what happens when that balance is disturbed.'],
    host: ['亚洲血管生物学学会、南方科技大学医学院和南方科技大学稳态医学研究院联合主办，广东省药理学会协办，深圳市生物医药促进会承办。', 'ASVB, the School of Medicine and the Homeostatic Medicine Institute at Southern University of Science and Technology jointly convened the event, with support from the Guangdong Pharmacological Society and local organizers in Shenzhen.'],
    sections: [
      [['血管稳态与重构', 'Vascular homeostasis and remodelling'], ['学者围绕血管稳态、血管重构和疾病发生，讨论如何将机制研究带来的线索用于疾病预防、诊断与治疗。', 'Researchers discussed vascular remodelling and disease mechanisms, including how discoveries from the laboratory could inform prevention, diagnosis and treatment.']],
      [['Tony J. F. Lee 纪念讲座', 'Tony J. F. Lee Memorial Lecture'], ['Maik Gollasch 教授讨论了血管周围脂肪组织与高血压的关系。', 'Maik Gollasch discussed perivascular adipose tissue and its role in hypertension.']],
      [['青年研究者交流', 'Early-career presentations'], ['联合会议设青年专题报告和青年口头报告，研究者在主会场、青年会场及 ASVB 专场之间交流。', 'The joint programme included a dedicated early-career track with thematic and oral presentations, alongside the plenary and ASVB sessions.']]
    ],
    numbers: [['3', ['联合会议会场', 'Venues at the joint meeting']], ['11', ['ASVB 专场报告', 'ASVB session talks']], ['≈200', ['联合会议参会者', 'Joint-meeting participants']]],
    source: 'shenzhen',
    sourceTitle: ['广东省药理学会会后报道', 'Guangdong Pharmacological Society report']
  }
];

export const history = [
  ['2004', ['学会创立 · 香港','Society founded · Hong Kong'], ['由 Paul M. Vanhoutte 教授倡议成立，致力于推动亚洲血管生物学与血管医学的发展。','Established at the initiative of Professor Paul M. Vanhoutte to advance vascular biology and medicine in Asia.']],
  ['2005', ['首届 · 上海','1st · Shanghai'], ['首届学术会议汇聚亚太地区的基础与临床研究者。','The inaugural meeting brought together basic and clinical researchers across the Asia-Pacific.'], sources.firstMeeting],
  ['2006', ['第二届 · 中国','2nd · China'], ['继上海首届会议后，学会在中国举行第二届学术会议。','After the inaugural meeting in Shanghai, the Society held its second scientific meeting in China.'], sources.huangProfile],
  ['2008', ['第三届 · 新加坡','3rd · Singapore'], ['第三届会议在新加坡国立大学举行。','The National University of Singapore hosted the third meeting.']],
  ['2010', ['第四届 · 香港','4th · Hong Kong'], ['第四届学术会议在香港举行。','Hong Kong hosted the fourth scientific meeting.'], sources.huangProfile],
  ['2012', ['第五届 · 西安','5th · Xi’an'], ['西安会议设青年研究者奖，并举办会员大会。','The Xi’an meeting featured a Young Investigator Award and a General Assembly.'], sources.xian],
  ['2014', ['第六届 · 吉隆坡','6th · Kuala Lumpur'], ['马来西亚吉隆坡举办第六届会议。','Kuala Lumpur, Malaysia, hosted the sixth meeting.'], sources.kualaLumpur],
  ['2016', ['第七届 · 花莲','7th · Hualien'], ['第七届会议由花莲慈济医院承办。','Hualien Tzu Chi Hospital hosted the seventh meeting.'], sources.hualien],
  ['2018', ['第八届 · 上海','8th · Shanghai'], ['与中国病理生理学会血管医学专业委员会第三届学术研讨会联合举行。','The eighth meeting was held jointly with the third symposium of the vascular medicine committee of the Chinese Association of Pathophysiology.'], sources.shanghai],
  ['2024', ['第九届 · 南京','9th · Nanjing'], ['黄聿教授作 Paul M. Vanhoutte 纪念讲座。','Professor Yu Huang delivered the Paul M. Vanhoutte Memorial Lecture.'], sources.nanjing],
  ['2025', ['第十届 · 深圳','10th · Shenzhen'], ['与第二届血管稳态与疾病研究前沿论坛联合举行。','The 10th ASVB meeting joined the second Conference on Vascular Homeostasis and Diseases.'], 'shenzhen-2025.html'],
  ['2026', ['第十一届 · 新加坡','11th · Singapore'], ['重返新加坡国立大学，设 Paul M. Vanhoutte 纪念讲座和青年学者论坛。','The meeting returned to the National University of Singapore and featured the Paul M. Vanhoutte Memorial Lecture and a Young Scholar Forum.'], 'singapore-2026.html'],
  ['2027', ['第十二届 · 澳门（拟定）','12th · Macao (planned)'], ['会议拟在澳门科技大学举行。','Macau University of Science and Technology is the proposed venue.'], 'macao-2027.html']
];
