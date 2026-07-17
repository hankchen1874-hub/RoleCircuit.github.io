# RoleCircuit 官网执行计划

## Background

官网仓库 `RoleCircuit.github.io` 目前只有占位 README。产品原型位于同一台机器的 `/Users/hongxichen/Desktop/auto-job`，其仓库文档将产品定义为 local-first 的 AI job-search runtime：扫描岗位、基于 CV 评估、生成定制文档、跟踪投递结果，并通过浏览器扩展辅助填写申请表，但不自动提交。

## Goal

搭建一个可直接部署到 GitHub Pages 的 RoleCircuit 静态官网首页，清楚说明产品用途、工作流、隐私边界与核心能力，并具备真实可用的导航、响应式布局和轻量交互。当前改版要求：全英文、移除旧版联系段落、避免黑色系，并增加产品细节。

## Scope

- `index.html`：单页官网内容与语义结构
- `styles.css`：完整视觉系统、响应式布局、动效与无障碍状态
- `script.js`：移动导航、工作流 tab、滚动进入动画和演示按钮行为
- `README.md`：项目运行和定位说明
- 本执行计划：记录假设、决策、验证与结果

本轮改版额外包含：

- 全站中文文案改为英文
- 暖白/森林绿/橙红/钴蓝浅色视觉系统
- 增加能力清单、工作流细节、运行边界和输入/输出说明

不包含：后端接入、表单收集、实际预约系统、Cloudflare 部署、自动投递功能。

## Assumptions

- 官网第一版服务于求职者/独立开发者，而不是招聘方 SaaS。
- 品牌名采用 `RoleCircuit`；文案中的“效率提升”不使用未经验证的数字承诺。
- 功能说明以 `/Users/hongxichen/Desktop/auto-job` 的 README、产品方向 ADR 和架构文档为依据。
- CTA 指向 GitHub 仓库与页面内产品区块；正式产品链接以后替换。

## Uncertainties

- 公司正式名称、联系人邮箱、产品是否最终公开发行尚未提供。
- Logo、产品截图和真实客户案例尚未提供，因此首版使用 CSS 构建的产品界面示意，不伪造客户背书。

## Implementation steps

1. 从 auto-job 文档提取真实功能边界与信任承诺。
   Verify: 官网文案覆盖扫描、评估、文档、跟踪、autofill、local-first 和 never-submit 边界。
2. 实现 warm editorial systems 视觉方向的静态首页。
   Verify: 页面包含 hero、产品演示、能力区、工作流、隐私承诺、CTA 与 footer。
3. 添加无框架交互和响应式行为。
   Verify: 移动导航、tab 切换、平滑锚点、按钮状态在无构建步骤下工作。
4. 运行结构检查并更新本计划。
   Verify: HTML 标签闭合、脚本可解析、工作区 diff 仅包含本任务文件。

## Verification approach

- `node --check script.js`
- 静态 HTML 结构/关键内容检查
- `git diff --check`
- `git status --short` 确认改动范围

## Progress log

- 2026-07-16：确认官网仓库为空壳，读取 auto-job README、产品方向 ADR 和 hiring-signal 架构文档。
- 2026-07-16：确定视觉方向为深色招聘操作控制室，使用橙色作为关键行动信号，避免伪造量化案例。
- 2026-07-16：完成首页、样式和轻量交互：移动端导航、工作流 tab、键盘左右切换、滚动进入效果。
- 2026-07-16：通过 `node --check script.js`、HTML 关键内容检查、`git diff --check`；本地浏览器预览确认三个静态资源均返回 200。
- 2026-07-16：根据反馈开始英文化、浅色改版与产品细节补充。
- 2026-07-16：完成全英文 copy、暖白浅色视觉、六项能力卡、输入/检查/输出细节和 operator model 区块。
- 2026-07-16：通过英文-only 检查、`node --check script.js`、`git diff --check`；本地浏览器预览确认英文页面结构与资源均正常加载。
- 2026-07-16：根据公司资料，将 OVRENI, LLC、Delaware LLC 和 Charlotte 注册地址加入页脚与 README。
- 2026-07-17：本地提交 `0e941ab` 已创建；push 被 GitHub 拒绝，当前 SSH 身份 `Jaydccq` 没有 `hankchen1874-hub/RoleCircuit.github.io` 写权限。
- 2026-07-17：创建 Cloudflare Pages 项目 `rolecircuit`，并将提交 `0e941ab` 的官网内容 direct deploy 到 production；部署 `4e751503` 成功，浏览器验证公开页面可加载。

## Key decisions

- 用产品真实边界（本地优先、用户数据自持有、只读扫描、永不自动提交）作为官网差异化核心。
- 采用纯 HTML/CSS/JS，避免为 GitHub Pages 首屏引入不必要的构建依赖。
- 用 CSS UI mockup 讲清工作流，后续可无缝替换为真实截图。
- 英文官网采用暖白纸张感背景和森林绿正文色，保持产品感但移除黑色主色。

## Risks and blockers

- 没有真实截图和正式客户案例；界面示意数据需要后续替换。
- 外部字体加载失败时会回退到本地系统字体；页面仍可阅读和操作。
- GitHub push 当前阻塞在账号权限：需要用有仓库写权限的 GitHub 账号重新认证，或把 `Jaydccq` 加入仓库。

## Final outcome

已完成 RoleCircuit 静态官网英文浅色改版，并补充 OVRENI, LLC 的法律主体信息与注册地址。页面采用纯 HTML/CSS/JS，不依赖构建步骤；Cloudflare Pages production 已成功部署到 `https://4e751503.rolecircuit.pages.dev/`。GitHub push 尚未完成，原因是当前 `Jaydccq` 身份没有目标仓库写权限。
