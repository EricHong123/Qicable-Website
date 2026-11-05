# 客户交付检查

独立安装后，使用Node24.20.0及npm11.19.0完成类型检查、66项测试、lint、静态构建、导出检查、SEO与结构化数据检查，均通过。检查输出见evidence/source-handoff/verification.log。

当前锁定依赖的npm运行时审计报告包含Next.js的critical级公告和Zod的high级公告，原始报告见evidence/source-handoff/runtime-audit.json。此源码交付保留当前项目依赖版本，尚未完成这些依赖的升级与兼容性验收。

仓库默认为私有。客户需要GitHub读取权限，连接正式服务器还需要个人SSH公钥授权及Agent账号。由管理员通过独立渠道提供这些权限。

源码快照包含当前工作区修改及完整准备好的20语言内容。正式文章仍有118个译文待完成原生发布。详见README.md和DEPLOYMENT.md。
