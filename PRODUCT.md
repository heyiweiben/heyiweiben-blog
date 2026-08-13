# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

由用户授权重写：TypeScript、React Router Framework Mode 与 Vite；构建为可由 Cloudflare 静态托管的真实 HTML。

## Users

- 主要读者是通过 `heyiweiben.com` 阅读何以为本个人文章的人。
- 作者在 Windows 的 `post/` 完成母稿，在明确授权发布后同步网站发布版；Mac 观澜负责部署、线上维护和未来可能的定时任务。

## Product Purpose

网站只承担两件事：让访问者对首页留下清晰的视觉印象，并让文章舒适、清楚地被阅读。成功意味着首页焦点明确、文章入口不重复、长文在桌面与手机上都易读。

## Positioning

它是一份围绕技术、商业与生活展开的个人独立网络刊物，不是个人履历页、项目展示页或内容门户。

## Operating Context

- `post/` 是文章母稿真源，`content/posts/` 是网站发布副本。
- Windows Codex 负责写作、编辑、发布版转换与发布前检查。
- Mac 观澜通过同一 GitHub 仓库负责部署和网站维护。
- GitHub 是双端交接通道；Syncthing 只同步项目工作文件，不替代 Git 历史。

## Capabilities and Constraints

- 展示首页、文章归档、文章正文、关于、轻量分类与标签索引。
- 保留现有已发布文章 URL、别名、RSS、站点地图、404、图标与分享图片。
- 所有公开页面在构建时输出真实 HTML；`draft: true` 永远不可访问。
- 未经明确授权，不发布文章、不推送 Git、不操作公众号、不创建或修改定时任务。
- 网站版可调整元数据、资源路径与格式，但不得静默改变作者观点。
- 首页文章只出现一次；分类和标签不进入主导航。

## Brand Commitments

- 名称为“何以为本”，页尾署名“何以为本 Lab”。
- 首页固定文案为“问题之下”“在技术、商业与生活之间。”
- 微信公众号名称为“何以为本Lab”。
- 用户已确认以当代山水为主题的五张参考图与拆分素材，位于 `references/locked/v1/` 与 `static/images/landscape/`。

## Evidence on Hand

- 已发布文章及其真实元数据位于 `content/posts/`，公开数量由 Markdown 的 `draft` 状态自动决定。
- 关于页真实文字位于 `content/about.md`。
- 已确认的五张页面参考图位于 `references/locked/v1/`。
- 已确认的分层山水素材位于 `static/images/landscape/`。
- 项目没有可用于宣传的客户数据、奖项、媒体背书或商业指标，未来工作不得虚构。

## Product Principles

1. 文章是主体，视觉服务阅读而不替代阅读。
2. 首页只给一次清晰的文章入口，避免门户式堆叠。
3. 母稿、网站发布版和线上状态边界清楚，可追溯、可交接。
4. 静态 HTML、稳定 URL 与无 JavaScript 可读性优先于炫技。
5. 动效有明确焦点并尊重减少动态效果的系统偏好。

## Accessibility & Inclusion

- 键盘可操作，焦点清晰，语义结构完整。
- 正文对比度与中文行宽满足长文阅读。
- `prefers-reduced-motion` 下停用首页景深动画并使用静态山水合成图。
