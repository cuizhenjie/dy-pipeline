import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  credentialsDocumentForMinimaxCn,
  load3coolRuntimeEnv,
  parseRuntimeEnvFile,
  seed3coolHome
} from '../src/main/state/3cool-runtime'

describe('3COOL MiniMax CN runtime seed', () => {
  it('parses KEY=value lines and ignores comments', () => {
    expect(parseRuntimeEnvFile('# comment\nMINIMAX_CN_API_KEY=sk-test\nEMPTY=\n')).toEqual({
      MINIMAX_CN_API_KEY: 'sk-test',
      EMPTY: ''
    })
  })

  it('prefers the packaged seed file over process env', async () => {
    const dir = await mkdtemp(join(tmpdir(), '3cool-seed-'))
    try {
      const seed = join(dir, '3cool-runtime.env')
      await writeFile(seed, 'MINIMAX_CN_API_KEY=from-seed\n')
      expect(load3coolRuntimeEnv(seed, { MINIMAX_CN_API_KEY: 'from-env' })).toEqual({
        MINIMAX_CN_API_KEY: 'from-seed'
      })
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('writes MiniMax CN credentials once and leaves an existing file alone', async () => {
    const dir = await mkdtemp(join(tmpdir(), '3cool-home-'))
    try {
      const first = seed3coolHome(dir, { MINIMAX_CN_API_KEY: 'sk-one' })
      expect(first.wroteCredentials).toBe(true)
      expect(await readFile(join(dir, '.credentials.yaml'), 'utf8')).toBe(
        credentialsDocumentForMinimaxCn('sk-one')
      )
      const second = seed3coolHome(dir, { MINIMAX_CN_API_KEY: 'sk-two' })
      expect(second.wroteCredentials).toBe(false)
      expect(await readFile(join(dir, '.credentials.yaml'), 'utf8')).toContain('sk-one')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
