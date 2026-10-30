// Publish the built site to the gh-pages branch, which GitHub Pages serves.
// Run with `npm run deploy`. The branch commit is built from dist/ without
// touching your working tree or the main branch.
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const run = (cmd, args, options = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...options })
const out = (cmd, args, options = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...options }).trim()

function remoteRepoName() {
  const url = out('git', ['remote', 'get-url', 'origin'])
  return url.replace(/\.git$/, '').split(/[/:]/).pop()
}

// "/" on a custom domain, "/<repo>/" for a username.github.io project page.
const base = existsSync('public/CNAME') ? '/' : `/${remoteRepoName()}/`
console.log(`Building with base ${base}`)

run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
  env: { ...process.env, VITE_BASE: base },
  stdio: 'inherit',
})
run(process.execPath, ['scripts/postbuild.mjs'])

// Assemble a commit from dist/ using a throwaway index, so the main working
// tree, branch and history stay untouched. dist/ is treated as the repository
// root here, otherwise the files would land under dist/ in the branch.
const gitDir = resolve('.git')
const indexPath = resolve(gitDir, 'gh-pages-index')
rmSync(indexPath, { force: true })
const env = { ...process.env, GIT_DIR: gitDir, GIT_WORK_TREE: '.', GIT_INDEX_FILE: indexPath }

run('git', ['add', '-A', '-f', '.'], { cwd: 'dist', env })
const tree = out('git', ['write-tree'], { env })
const commit = out('git', ['commit-tree', tree, '-m', 'Deploy portfolio site'])
run('git', ['push', '--force', 'origin', `${commit}:refs/heads/gh-pages`])
rmSync(indexPath, { force: true })

console.log(`Published ${commit.slice(0, 7)} to gh-pages`)
