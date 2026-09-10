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
  assert.equal(
    packageJson.dependencies['@deepseek-ai/dsh-llm-pi-ai'],
    '0.1.5-rc.1',
  )
})

test('registers the Token Market route without embedding credentials', () => {
  assert.match(patch, /providers:\s+tokensmarket:/s)
  assert.match(patch, /apiKeyEnv: TOKENSMARKET_API_KEY/)
  assert.match(patch, /api: openai-completions/)
  assert.match(patch, /baseURL: https:\/\/api\.tokensmarket\.ai\/v1/)
  assert.doesNotMatch(patch, /Authorization:\s*Bearer/i)
})

test('ships a non-empty verified starter catalog', () => {
  for (const id of ['deepseek-v4-pro', 'gpt-5.6-sol', 'glm-5.2']) {
    assert.match(patch, new RegExp(`- id: ${id.replace('.', '\\.')}`))
  }
})
