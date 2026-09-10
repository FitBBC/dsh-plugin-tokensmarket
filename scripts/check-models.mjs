const baseURL = 'https://api.tokensmarket.ai/v1'
const requiredModels = ['deepseek-v4-pro', 'kimi-k3', 'glm-5.3']
const apiKey = process.env.TOKENSMARKET_API_KEY

if (!apiKey) {
  console.error('TOKENSMARKET_API_KEY is required to check the live model catalog.')
  process.exit(2)
}

const response = await fetch(`${baseURL}/models`, {
  headers: { Authorization: `Bearer ${apiKey}` },
})

if (!response.ok) {
  console.error(`GET /models failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const payload = await response.json()
const models = Array.isArray(payload.data)
  ? payload.data
  : Array.isArray(payload.models)
    ? payload.models
    : []
const available = new Set(models.map((model) => model?.id).filter(Boolean))
const missing = requiredModels.filter((id) => !available.has(id))

if (missing.length > 0) {
  console.error(`Missing configured models: ${missing.join(', ')}`)
  process.exit(1)
}

console.log(`Verified ${requiredModels.length} configured Token Market models.`)
