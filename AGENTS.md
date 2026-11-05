# Qicable Codex 工作约定

先阅读 README.md、DESIGN.md 与 DEPLOYMENT.md。本项目是 Next.js 前端及原生服务器渲染模板。

保留20语言 en/de/es/fr/pt/ar/it/nl/pl/cs/sv/da/fi/no/ru/tr/ja/ko/vi/id，以及现有产品型号、事实、关键词和URL。产品事实和文章发布以 Agent 批准的内容为准。图片使用原始型号匹配素材。

UI调整先在本地验证。检查320/390px、平板及桌面，德语长文本和阿拉伯语RTL。右侧联系按钮依次为WhatsApp、Email、询盘表单。

使用可用的设计技能完善设计说明。若安装了typesafe-ai，可用于有依据的文本语义判断。模型调用需要服务端凭据，人工视觉核查和TypeScript检查应实际执行。

提交前运行 README 中的检查。常规修改从 codex/ 前缀功能分支开始，清楚记录修改与验收。部署沿用 DEPLOYMENT.md 的 native 发布流程，先制作候选、备份、验证和可回退方案，再切换正式版本。

服务器SSH私钥与环境文件保存在Git外。正式发布过程中如内容已更新，重新读取当前Agent快照，避免用仓库的预览快照覆盖当前正式内容。
