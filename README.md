# 何以为本网站

`heyiweiben.com` 的静态网站仓库。页面由 TypeScript、React Router Framework Mode 与 Vite 构建，文章继续使用 `content/` 中的 Markdown；`draft: true` 不会进入公开网站。

Agent 开始工作前先阅读仓库根目录的 `AGENTS.md`。项目协作不依赖 OpenClaw、Hermes 或 Codex 各自工作区中的旧网站副本和旧发布 Skill。

## 本地使用

需要 Node.js 20.9 或更高版本，并使用 `package.json` 中 `packageManager` 指定的 pnpm 11 版本。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

本地预览默认位于 `http://127.0.0.1:1313/`。如果端口已被旧进程占用，开发服务器会选择下一可用端口。

## 发布前检查

```bash
pnpm test
pnpm typecheck
pnpm build
```

Cloudflare 静态输出目录是 `build/client`。构建同时生成首页、文章、归档、关于、分类与标签的真实 HTML，以及 RSS、站点地图、404、旧文章别名跳转和 WebP 交付图片。

## Windows Codex 与 Mac 观澜

1. Windows 与 Mac 分别在 Agent 工作区、Obsidian Vault 和 Syncthing 范围之外维护独立 clone。Windows 当前路径为 `D:\hehaoguo\repos\heyiweiben-blog`；Mac 当前路径为 `/Users/hehaoguo/repos/heyiweiben-blog`。
2. Windows Codex 主要负责网站架构、视觉重构、前端实现、响应式适配和本地质量验收。
3. 何以为本负责文章正文、标题、摘要和最终公开表达。Mac Hermes/观澜默认只负责母稿整理与审稿、生成 `content/posts/` 网站发布版、准备微信公众号版本和执行已获授权的发布；具体文字编辑必须另行明确授权。
4. 观澜发布前运行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm typecheck`、`pnpm build` 和 `pnpm check`，按授权提交并推送 GitHub，再检查 Cloudflare 和线上 URL；成功后立即回写母稿的 `published` 状态、发布日期和正式 URL。
5. Cloudflare 只托管 `build/client`；不需要 Hugo，也不要恢复 PaperMod 子模块。
6. GitHub 是网站代码同步与发布历史的唯一通道。网站代码不得通过 Syncthing、Vault、Agent 工作区、共享工作树或 patch 交接；未获提交或推送授权时，改动只保留在发起设备并报告状态。
7. 未经何以为本明确授权，任何 Agent 都不推送、不部署、不操作公众号、不创建定时任务。

## 视觉依据

- 锁定参考图：`references/locked/v1/`
- 山水 PNG 母版：`static/images/landscape/`
- 响应式验收截图：`qa/desktop/`、`qa/ultrawide/`、`qa/mobile/`
- 产品事实：`PRODUCT.md`
- 视觉系统：`DESIGN.md`
