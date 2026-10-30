// GitHub Pages serves 404.html for any path it does not have a file for.
// Copying the built single-page shell there lets React Router handle deep
// links such as /work/aurora instead of showing GitHub's 404 page.
import { copyFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist', import.meta.url))

// Drop source maps and hidden files; nothing in the site needs them.
function clean(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name.startsWith('.') || name.endsWith('.map')) {
      rmSync(path, { recursive: true, force: true })
      continue
    }
    if (statSync(path).isDirectory()) clean(path)
  }
}

clean(dist)
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log('postbuild: wrote dist/404.html')
