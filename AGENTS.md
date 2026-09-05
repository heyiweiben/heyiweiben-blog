# 何以为本网站仓库协作规则

## 仓库边界

- 正式远端：`https://github.com/heyiweiben/heyiweiben-blog.git`。
- Windows 与 Mac 各自在 Agent 工作区、Obsidian Vault 和 Syncthing 范围之外维护独立 clone。
- 网站代码只通过 Git 提交、分支和 GitHub 同步；不得通过 Syncthing、Vault、Agent 工作区、共享工作树或 patch 交接。
- 本仓库内的 `AGENTS.md`、`README.md`、`PRODUCT.md` 和 `DESIGN.md` 是网站实现与维护规则来源。`docs/openclaw-publishing.md` 已退役，不再作为操作依据。

## 内容边界

- `content/posts/` 是网站发布副本，不是文章母稿真源。
- 文章母稿真源位于独立的“何以为本 Lab”内容项目 `post/` 中。
- 何以为本负责正文、标题、摘要和最终公开表达。Agent 默认只做审稿、元数据与技术适配；具体文字编辑必须获得针对文章和字段的明确授权。
- `status: ready` 或“写完”不等于发布授权。未经明确授权，不发布文章、不推送 Git、不操作公众号、不更改部署或定时任务。
- 网站版可调整 front matter、资源路径、链接和技术格式，但不得静默改变作者观点；实质修改应先回写母稿。

## 开始工作

1. 运行 `git status --short --branch` 和 `git fetch origin --prune`。
2. 确认远端、当前分支、领先/落后关系及未提交文件来源。
3. 遇到未知改动或基线分歧时停止覆盖，先备份、审阅并通过 Git 流程收敛。
4. 不从 Agent 缓存、旧工作区、Vault 网站镜像或历史 Hugo/PaperMod 仓库恢复代码。

## 验收

网站修改完成后运行：

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
pnpm check
```

所有检查通过后再按用户授权提交或推送。完成汇报应说明修改文件、文章状态、构建结果、提交哈希、推送/部署状态和下一位 Agent 的动作。
