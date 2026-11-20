import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destination = path.join(projectRoot, 'build', '3cool-runtime.env')
const key = (process.env.MINIMAX_CN_API_KEY ?? '').trim()
if (key === '') {
  try {
    const existing = await readFile(destination, 'utf8')
    if (/^MINIMAX_CN_API_KEY=\S+/mu.test(existing)) {
      console.log('Kept existing 3COOL runtime seed.')
      process.exit(0)
    }
  } catch {
    // File is created below when no seed exists yet.
  }
}
const body = key === ''
  ? '# No MiniMax CN key provided at packaging time.\n'
  : `MINIMAX_CN_API_KEY=${key}\n`
await writeFile(destination, body, { mode: 0o600 })
console.log(
  key === ''
    ? 'Wrote empty 3COOL runtime seed (MINIMAX_CN_API_KEY unset).'
    : 'Wrote 3COOL runtime seed with MINIMAX_CN_API_KEY.'
)
