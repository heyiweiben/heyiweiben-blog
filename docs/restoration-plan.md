# 何以为本 React 重构复刻执行 brief

## 主要基线

- 视觉锚点：`references/locked/v1/01-hero.png`。
- 参考组：首页 Hero、首页精选文章、文章归档、长文阅读、关于页。
- 唯一内容真源：现有 `content/` Markdown；不修改文章观点和正文。

## 全局系统

- 配色：雾米白 `#F3F0E8`、深青墨 `#173D3A`、山林绿 `#6D9B88`、暮色蓝 `#7186A6`、夕照橙 `#DE765F`。
- 导航：左侧代码文字“何以为本”，右侧代码文字“索引”；索引打开后显示文章、关于、联系。
- 字体：标题和界面使用本地中文无衬线；正文使用本地中文衬线。避免异形字与书法字。
- 容器：开放式 section、细分隔、近乎无圆角、无卡片墙和厚重阴影。
- 全站共享材质：`/images/landscape/paper-grain.png`，低透明度铺底。
- 文字、导航、链接、日期、摘要、文章正文和筛选全部 code-native；图片中不得承载事实文字。

## Section contracts

### Hero

- 拓扑：`section-specific`；多层山体只服务首页 Hero。
- 三秒信息：何以为本是围绕问题和思考展开的个人写作网站。
- 焦点：`问题之下` → 山水 → 副标题。
- 文字安全区：桌面左侧约 8%–48% 宽度；移动端为上半部。
- 素材：`hero-sky.png`、`hero-far.png`、`hero-mid.png`、`hero-near.png`、`hero-static.png`。
- 动效：三张山体使用 CSS `mix-blend-mode:multiply`、柔和 mask 与不同滚动速度；CSS 雾层低频水平漂移。移动端减弱位移；`prefers-reduced-motion` 只显示 `hero-static.png`。
- 不允许：山体进入标题闭合排除区；线条、节点、球体、额外按钮或 Hero 标签。

### 首页精选文章

- 拓扑：`section-specific`；一主两次的纵向编辑索引。
- 三秒信息：三篇可阅读文章，第一篇为置顶精选。
- 素材：`writing-haze.png` 作为静态背景。
- code-native：栏目名、三篇文章、日期、摘要、分隔线和“查看全部文章”。
- 响应式：手机端保持纵向顺序，标题自然换行；不改为卡片。

### 文章归档

- 拓扑：`section-specific`；年份与文章行构成时间索引。
- 三秒信息：按年份浏览全部已发布文章，并可按分类筛选。
- 素材：`archive-haze.png`。
- code-native：标题、说明、年份、文章、日期、分类筛选和夕照橙选中线。
- 响应式：筛选可横向换行；山水裁切至右下；草稿永不进入数据清单。

### 长文阅读

- 拓扑：`section-specific`；宽标题区进入约 `44rem` 中文正文列。
- 三秒信息：标题、日期、字数、导语和正文起笔均在第一屏形成完整阅读路径。
- 素材：`article-heading-haze.png`，仅用于页首并向正文渐隐。
- code-native：全部 Markdown 内容、标题锚点、链接、引用、图片、代码块和元数据。
- 响应式：正文保持舒适行长；无悬浮目录、进度条或持续背景动画。

### 关于

- 拓扑：`section-specific`；文字位于雾谷中央安全区。
- 三秒信息：网站写什么、为什么写、长期原则和联系方式。
- 素材：`about-valley.png`。
- code-native：现有关于页完整文字、五类内容、强调句和邮箱。
- 响应式：手机端山谷落到文字下方，不遮挡段落。

## 素材 manifest

| 路径 | 来源 | 用途 |
| --- | --- | --- |
| `static/images/landscape/paper-grain.png` | generate | 全站共享纸感 |
| `static/images/landscape/hero-static.png` | generate | reduced motion / 静态降级 |
| `static/images/landscape/hero-sky.png` | generate | Hero 天空底层 |
| `static/images/landscape/hero-far.png` | generate | Hero 远山层 |
| `static/images/landscape/hero-mid.png` | generate | Hero 中景层 |
| `static/images/landscape/hero-near.png` | generate | Hero 近景层 |
| `static/images/landscape/writing-haze.png` | generate | 首页文章区背景 |
| `static/images/landscape/archive-haze.png` | generate | 归档背景 |
| `static/images/landscape/article-heading-haze.png` | generate | 文章页首背景 |
| `static/images/landscape/about-valley.png` | generate | 关于页背景 |

## 实施顺序与验收

1. 建立 React Router Framework Mode、内容生成管线和全局外框。
2. 只实现 Hero，在 `1672×941` 截图对照通过后继续。
3. 实现首页文章区，再实现归档、文章、关于。
4. 每个 section 分别补齐 `2200×1200` 与 `390×844` 截图。
5. 生成 RSS、sitemap、404 和旧别名；验证三篇公开文章与草稿排除。
6. 更新协作文档；不推送、不部署、不创建定时任务。

## 允许偏差

- 参考图里的文字仅用于层级；最终必须使用真实代码文字与真实文章内容。
- Hero 透明素材生成失败后，已按批准的风险预案改为三张雾米白底山体，通过 CSS 混合和遮罩实现景深；雾气由 CSS 生成。
- 手机端允许重新裁切山水，但不改变焦点顺序和文章内容。
