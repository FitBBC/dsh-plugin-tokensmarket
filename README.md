# Token Market for DeepSeek Harness

An installable [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
Profile Bundle that adds [Token Market](https://www.tokensmarket.ai) as an
OpenAI-compatible model provider.

[中文说明](README.zh-CN.md)

## Features

- One Token Market API key for multiple model families.
- Streaming responses and tool calling through the Harness pi-ai adapter.
- Reasoning output through the DeepSeek-compatible thinking format.
- Live model discovery through `GET /v1/models`.
- Credentials stay outside the repository and configuration file.

The starter catalog includes DeepSeek V4 Pro, Kimi K3, and GLM-5.3. The
catalog is intentionally small so every bundled model can be tested and kept
current.
These models were confirmed available through Token Market on September 10,
2026.

## Requirements

- DeepSeek Harness developer preview compatible with `0.1.5-rc.1`.
- Node.js `^22.19.0` or `>=24.0.0`.
- A Token Market API key from the
  [Token Market Console](https://www.tokensmarket.ai/console).

## Install

Install the bundle into a Harness profile:

```bash
dsh plugin --profile web add github:FitBBC/dsh-plugin-tokenmarket
```

Verify that the bundle is present in the composed profile:

```bash
dsh --profile web --dump-config
```

Set the credential in your environment or a Harness-supported `.env` file:

```bash
TOKENMARKET_API_KEY=your_api_key
```

Restart the profile after adding the bundle:

```bash
dsh --profile web
```

Token Market will appear as the `tokenmarket` provider.

## Verify the live catalog

```bash
TOKENMARKET_API_KEY=your_api_key npm run check:models
```

This command calls the authenticated Token Market model endpoint and fails if
one of the bundled starter models is no longer available.

## How it works

This package is a configuration-only Harness Profile Bundle. Its
`cordis.patch.yml` mounts the official `@deepseek-ai/dsh-llm-pi-ai` adapter and
registers a `tokenmarket` route with:

- API base URL: `https://api.tokensmarket.ai/v1`
- Protocol: `openai-completions`
- Credential reference: `TOKENMARKET_API_KEY`

See the [Token Market documentation](https://www.tokensmarket.ai/docs) for API
details and the [model catalog](https://www.tokensmarket.ai/models) for current
availability and pricing.

## Development

```bash
npm test
npm pack --dry-run
```

## License

MIT
