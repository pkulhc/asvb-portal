# ASVB · 亚洲血管生物学学会

亚洲血管生物学学会的中英文学术门户。首页介绍学会及拟在澳门举行的第十二届学术会议，并收录新加坡第十一届和深圳第十届会议回顾。

[访问中文网站](https://pkulhc.github.io/asvb-portal/) · [English website](https://pkulhc.github.io/asvb-portal/en/) · [第十二届会议](https://pkulhc.github.io/asvb-portal/macao-2027.html) · [赞助招商](https://pkulhc.github.io/asvb-portal/sponsorship.html)

![澳门 2027 会议宣传网站首页](preview.webp)

澳门会议页和宣传图中的南湾湖夜景由 Diego Delso 摄影，采用 CC BY-SA 3.0 许可。[照片原作](https://commons.wikimedia.org/wiki/File:Lago_Nam_Van,_Macao,_2013-08-08,_DD_04.jpg) · [许可条款](https://creativecommons.org/licenses/by-sa/3.0/)

## 浏览

下载或克隆仓库后，用浏览器打开 [中文首页](dist/index.html) 或 [English home](dist/en/index.html)。图片、字体、第一轮通知、参会回执、摘要模板及会议日历均随网站提供。澳门会议页提供中英文宣传图，二维码直达对应语言的会议通知。历届会议主题出处及图片许可见[资料与图片](dist/sources.html)。

本机预览可在仓库根目录运行下列命令，然后在浏览器中访问 <http://127.0.0.1:8000/>。

```console
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

## 内容维护

- `content.mjs` 保存两届会议回顾、学会沿革及公开资料链接。
- `build.mjs` 生成两种语言的 HTML 和第十二届会议的日历文件。修改后在仓库根目录运行 `node build.mjs`，将更新后的 `dist` 一并提交。
- `dist/site.css` 和 `dist/site.js` 分别管理排版和导航。`dist/assets` 保存本地图片、字体及许可证，`dist/downloads` 保存可下载的参会材料。
- `content.mjs` 中会议记录的 `gallery` 字段生成回顾页的“会议现场”图集；图片放在 `dist/assets`，建议先压缩为约 1280 px 宽的 WebP。
- 中文标题字体 `dist/assets/cn-display.woff2` 是 Noto Serif SC 的子集。新增标题用字后运行 `python3 scripts/update_display_font.py path/to/NotoSerifSC.ttf`（需要 fonttools 和完整的 Noto Serif SC 字体文件，下载地址见脚本说明），补入缺字后再检查页面。
- 赞助档位、价格、展位规格和权益确定之前，赞助招商页只提供秘书处洽谈入口；确定后再写入 `build.mjs` 的 sponsorship 部分。
- 第十二届采用第一轮通知的拟定日程和收费口径。更新会期时，同时检查页面、日历和下载附件。第十一届回顾中的统计采用会后报道，下载的 PDF 保留会前日程。

GitHub Pages 从 `gh-pages` 分支根目录发布网站。在 `main` 提交并推送更新后，运行 `git subtree push --prefix dist origin gh-pages` 即可发布新版。
