# 客户连接服务器与更新网站

当前站点为 https://www.qicable.com/ ，Agent 为 https://agent.qicable.com/ 。服务器为47.79.229.32，运行目录为 `/srv/qicable`，Compose项目为qicable。

## 配置个人SSH访问

请由服务器管理员为客户建立独立SSH账号与公钥授权，并授予完成网站发布所需的权限。客户私钥存放在自己的电脑上。在 `~/.ssh/config` 添加配置，按实际授权用户名和私钥路径填写。

```sshconfig
Host qicable-production
  HostName 47.79.229.32
  User YOUR_AUTHORIZED_USER
  IdentityFile ~/.ssh/qicable_ed25519
  IdentitiesOnly yes
```

```sh
ssh qicable-production
cd /srv/qicable
docker compose ps
```

Codex在客户电脑上可直接通过该SSH别名检查部署状态。源码仓库已公开，可直接克隆。正式发布需要服务器账号权限与Agent发布账号。

## 当前部署方式

正式网站采用Agent原生发布器。2026-11-04已部署的模板运行目录为 `/srv/qicable/native-runtime/20261104-i18n01`，配置目录为 `/srv/qicable/config/native-20261101`。Agent通过只读挂载使用模板与配置。正式网站由原生publication的current指针选择版本。

旧的静态部署方式已不是当前原生站点的发布入口。直接替换服务器模板文件会与当前模板和配置摘要不一致，因此UI更新需要作为新模板版本发布。

## UI更新执行顺序

1. 拉取仓库，在功能分支修改并完成本地检查，提交代码。
2. SSH读取服务器当前Compose挂载、Agent版本、模板配置和publication/current。记录当前版本与回退点，备份数据库、配置及发布历史。
3. 从Agent导出当前批准的文章、产品和媒体快照，供新模板构建使用。保留用户新内容，仓库的预览快照只用于本地展示。
4. 将已提交的源码传入服务器一个新候选目录，使用锁定的Node/npm版本安装依赖并构建native-template。构建输入包含同一版本的ui、preview、content、config、scripts与package-lock.json。
5. 按服务器现有native发布器合约生成模板源码摘要、运行时文件清单及新配置。`scripts/native-candidate.mjs`仅负责渲染候选，它的参数由Agent受控传入。
6. 在候选版本验证路由、媒体、20语言、SEO、菜单、表单及移动端，再通过现有原生发布流程切换模板与current。
7. 核验正式公网文件与发布清单，确认Agent就绪、询盘接口可用，保留完整证明与回退版本。

本仓库提供网站源码与候选渲染器。模板接纳、配置摘要锁定、Agent身份验证与正式指针切换依赖服务器当前部署服务。部署时让Codex读取实际服务器状态并沿用该服务，本仓库尚未提供一键正式发布命令。

## 回退

使用当前native发布历史中已验收的回退版本，恢复匹配的模板配置及运行时。切换前核对当前版本归属与并发操作。数据库若已产生新询盘或新内容，应保留这些新增记录，并按原生发布历史回退网站版本。

## 交付状态

本仓库保存2026-11-05工作区源码，包含正式部署之后的本地修改。它与某个正式release的文件摘要并非逐项相同。正式站的当前版本应以服务器publication台账为准。二十语言模板及Agent已切换，新增译文的后续发布仍需完成。
