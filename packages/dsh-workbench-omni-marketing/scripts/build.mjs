import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

// The host module loader injects `require` into the factory, so React and other
// shared-baseline modules are resolved at runtime instead of being bundled.
await build({
  entryPoints: [`${root}src/client/index.jsx`],
  outfile: `${root}lib/client.js`,
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: false,
  sourcemap: false,
  logLevel: 'warning',
})
console.log('omni-marketing: lib/client.js built')
