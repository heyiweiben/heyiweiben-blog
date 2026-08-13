# 何以为本网站

`heyiweiben.com` 的静态网站仓库。页面由 TypeScript、React Router Framework Mode 与 Vite 构建，文章继续使用 `content/` 中的 Markdown；`draft: true` 不会进入公开网站。

## 本地使用

需要 Node.js 20 或更高版本，并启用 pnpm。

```bash
pnpm install
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

1. 开始网站工作前运行 `git status`，并从远端拉取最新提交。
2. Windows Codex 主要负责网站架构、视觉重构、前端实现、响应式适配和本地质量验收。
3. Mac 观澜负责文章写作与发布：维护项目根目录 `post/` 母稿，生成 `content/posts/` 网站发布版，并准备微信公众号版本。
4. 观澜发布前运行 `pnpm install --frozen-lockfile`、`pnpm test`、`pnpm typecheck`、`pnpm build`，按授权提交并推送 GitHub，再检查 Cloudflare 和线上 URL。
5. Cloudflare 只托管 `build/client`；不需要 Hugo，也不要恢复 PaperMod 子模块。
6. Codex 完成网站修改后通过 Syncthing 交接，观澜负责复核和正式发布；两端不得同时执行 Git 写操作。
7. 未经何以为本明确授权，任何 Agent 都不推送、不部署、不操作公众号、不创建定时任务。

## 视觉依据

- 锁定参考图：`references/locked/v1/`
- 山水 PNG 母版：`static/images/landscape/`
- 响应式验收截图：`qa/desktop/`、`qa/ultrawide/`、`qa/mobile/`
- 产品事实：`PRODUCT.md`
- 视觉系统：`DESIGN.md`
