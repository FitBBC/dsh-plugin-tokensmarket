import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)
const patch = await readFile(
  new URL('../cordis.patch.yml', import.meta.url),
  'utf8',
)

test('declares a DeepSeek Harness Profile Bundle', () => {
  assert.equal(packageJson.dsh.bundle.patch, './cordis.patch.yml')
})

test('configures the existing pi-ai row without mounting a second adapter', () => {
  assert.match(patch, /^- id: llm-pi-ai$/m)
  assert.doesNotMatch(patch, /^\s*- insert:/m)
  assert.doesNotMatch(patch, /name:\s*['"]?@deepseek-ai\/dsh-llm-pi-ai/)
  assert.equal(packageJson.dependencies?.['@deepseek-ai/dsh-llm-pi-ai'], undefined)
})

test('registers the Token Market route without embedding credentials', () => {
  assert.match(patch, /providers:\s+tokenmarket:/s)
  assert.match(patch, /apiKeyEnv: TOKENMARKET_API_KEY/)
  assert.match(patch, /api: openai-completions/)
  assert.match(patch, /baseURL: https:\/\/api\.tokensmarket\.ai\/v1/)
  assert.doesNotMatch(patch, /Authorization:\s*Bearer/i)
})

test('ships a non-empty verified starter catalog', () => {
  for (const id of ['deepseek-v4-pro', 'kimi-k3', 'glm-5.3']) {
    assert.match(patch, new RegExp(`- id: ${id.replace('.', '\\.')}`))
  }
})
