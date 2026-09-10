# DeepSeek Harness 的 Token Market 插件

这是一个可安装的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
Profile Bundle，用于将 [Token Market](https://www.tokensmarket.ai) 添加为
OpenAI 兼容模型供应商。

[English](README.md)

## 功能

- 使用一个 Token Market API Key 访问多个模型系列。
- 通过 Harness 官方 pi-ai Adapter 支持流式响应和工具调用。
- 使用 DeepSeek 兼容格式返回推理内容。
- 通过 `GET /v1/models` 发现当前可用模型。
- API Key 不写入仓库或 Bundle 配置。

首版内置 DeepSeek V4 Pro、Kimi K3 和 GLM-5.3。内置目录保持精简，
便于逐个验证并及时维护。

## 环境要求

- 与 `0.1.5-rc.1` 兼容的 DeepSeek Harness 开发预览版。
- Node.js `^22.19.0` 或 `>=24.0.0`。
- 从 [Token Market 控制台](https://www.tokensmarket.ai/console) 获取的 API Key。

## 安装

将 Bundle 安装到 Harness Profile：

```bash
dsh plugin --profile web add github:FitBBC/dsh-plugin-tokensmarket
```

在环境变量或 Harness 支持的 `.env` 文件中配置凭据：

```bash
TOKENSMARKET_API_KEY=your_api_key
```

添加 Bundle 后重启 Profile：

```bash
dsh --profile web
```

Token Market 会以 `tokensmarket` Provider 出现在模型选择界面中。

## 校验在线模型目录

```bash
TOKENSMARKET_API_KEY=your_api_key npm run check:models
```

该命令会访问需要鉴权的 Token Market 模型接口；如果任一内置模型已经
不可用，命令会返回失败。

## 实现方式

该项目是纯配置型 Harness Profile Bundle。`cordis.patch.yml` 挂载官方
`@deepseek-ai/dsh-llm-pi-ai` Adapter，并注册以下路由：

- API 地址：`https://api.tokensmarket.ai/v1`
- 协议：`openai-completions`
- 凭据变量：`TOKENSMARKET_API_KEY`

API 说明请查看 [Token Market 文档](https://www.tokensmarket.ai/docs)，当前
模型和价格请查看[模型目录](https://www.tokensmarket.ai/models)。

## 开发校验

```bash
npm test
npm pack --dry-run
```

## 许可证

MIT
