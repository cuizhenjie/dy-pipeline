import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const MINIMAX_CN_KEY_REF = 'MINIMAX_CN_API_KEY'

export function parseRuntimeEnvFile(text: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    let value = line.slice(eq + 1)
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2)
      || (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1)
    }
    result[line.slice(0, eq)] = value
  }
  return result
}

export function load3coolRuntimeEnv(
  seedFile: string | undefined,
  env: NodeJS.ProcessEnv
): NodeJS.ProcessEnv {
  const extra: NodeJS.ProcessEnv = {}
  if (seedFile && existsSync(seedFile)) {
    try {
      Object.assign(extra, parseRuntimeEnvFile(readFileSync(seedFile, 'utf8')))
    } catch {
      // Seed is optional; a missing or unreadable file leaves process env unchanged.
    }
  }
  const key = extra[MINIMAX_CN_KEY_REF] || env[MINIMAX_CN_KEY_REF]
  if (typeof key === 'string' && key.trim() !== '') extra[MINIMAX_CN_KEY_REF] = key.trim()
  else delete extra[MINIMAX_CN_KEY_REF]
  return extra
}

export function credentialsDocumentForMinimaxCn(apiKey: string): string {
  return `version: 1\nrefs:\n  ${MINIMAX_CN_KEY_REF}: ${JSON.stringify(apiKey)}\n`
}

export function seed3coolHome(
  dshHome: string,
  runtimeEnv: NodeJS.ProcessEnv
): { wroteCredentials: boolean } {
  const apiKey = runtimeEnv[MINIMAX_CN_KEY_REF]
  if (!apiKey) return { wroteCredentials: false }
  mkdirSync(dshHome, { recursive: true })
  const credentials = join(dshHome, '.credentials.yaml')
  if (existsSync(credentials)) return { wroteCredentials: false }
  try {
    writeFileSync(credentials, credentialsDocumentForMinimaxCn(apiKey), { mode: 0o600, flag: 'wx' })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
      return { wroteCredentials: false }
    }
    throw error
  }
  try {
    chmodSync(credentials, 0o600)
  } catch {
    // Windows cannot apply POSIX modes.
  }
  return { wroteCredentials: true }
}
