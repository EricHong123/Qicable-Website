# Qicable 网站源码

Qicable 当前工作区的前端源码，包含 Next.js、React、TypeScript、20种语言字典、产品与博客布局、原生发布模板和网站素材。

## 拉取与本地运行

需要 Node 24.20.0 和 npm 11.19.0。仓库已公开，可直接克隆。

```sh
git clone https://github.com/EricHong123/Qicable-Website.git
cd Qicable-Website
npm ci
npm run dev
```

打开 http://127.0.0.1:3104/。默认预览使用仓库的基础内容。

包含全部准备好的20语言文章内容进行预览，可使用下面的命令。路径必须是绝对路径。

```sh
QICABLE_CONTENT_SNAPSHOT="$PWD/content/native-i18n-preview.json" QICABLE_NATIVE_MEDIA_ROOT="$PWD/preview/public" npm run dev
```

该内容快照包含240个文章语言版本。2026-11-04阶段的正式发布记录为122个文章语言版本，另118个待恢复已登录 Agent 后继续发布。快照用于预览，正式文章与产品以 Agent 当前批准的版本为准。

## 修改入口

- `ui/src/pages.tsx` 和其他组件负责页面内容与布局。
- `ui/src/tokens.css`、CSS modules 与 `DESIGN.md` 管理视觉样式。
- `ui/src/header-navigation.tsx` 管理菜单。
- `content/translations/` 与 `ui/src/i18n.ts` 管理语言内容。
- `ui/assets/` 保存原图、WebP、视频、字体和品牌素材。
- `preview/` 提供本地 Next.js 预览与静态导出。
- `native-template/` 与 `scripts/native-candidate.mjs` 对接服务器原生发布器。

交给 Codex 的任务可以这样写。

> 先阅读 AGENTS.md、DESIGN.md 和 DEPLOYMENT.md。启动本地网站，把首页产品分类布局调整为不规则网格。保留20语言、阿拉伯语RTL和现有产品身份，检查移动端及德语长文本，完成检查后提交到功能分支。

## 检查和构建

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run check:export
```

若构建使用了20语言预览快照，构建与导出检查必须使用相同输入，避免页数断言与构建内容不一致：

```sh
export QICABLE_CONTENT_SNAPSHOT="$PWD/content/native-i18n-preview.json"
export QICABLE_NATIVE_MEDIA_ROOT="$PWD/preview/public"
npm run build
npm run check:export
```

静态输出在 `preview/out/`。本地询盘接口默认代理至127.0.0.1:3101，UI预览可以独立运行，实际提交需要配置服务端接口。

服务器连接与发布流程见 [DEPLOYMENT.md](DEPLOYMENT.md)。本仓库采用单独的新 Git 历史，保存网站交付源码。访问密钥、服务器环境文件、数据库和询盘附件通过独立授权渠道配置。

## 增量更新与自动推送约定

每次仅修改任务所需内容，完成相关检查并更新本 README 后，自动提交并推送到 origin 的当前 `codex/` 功能分支，无需再次确认。仅提交当前任务相关文件，不强制推送、不自动合并 `main`。本次引入的检查失败须修复；既有环境或资料缺失须记录。推送失败时保留本地成果并说明原因。GitHub源码推送与VPS正式部署是两个独立步骤，后者继续遵循 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 最新增量：2026-11-06 首页选型流程

- 将首页设备连接说明改为四个编号节点与箭头；桌面四列，手机和平板纵向，适配阿拉伯语 RTL。
- 保留20语言文案、原有顺序、产品和咨询链接；新增样式局限于首页，不新增运行依赖。
- TypeScript、ESLint、生产构建及2460页导出、SEO、结构化数据检查通过；已人工检查英/德/阿在320/390/768/1440px的布局。
- 现有66项测试中65项通过；1项因缺少17份仓库外历史归档图片而失败。德语首页原证书区在320px下仍有约41px溢出，本次流程区域无内容溢出。
- 未发布到VPS。实现、截图和验收记录见 [选型流程记录](plans/2026-11-06-selection-flow.md)。
