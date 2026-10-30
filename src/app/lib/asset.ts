// Resolve a path from `public/` against the deployed base path, so the same
// build works on a custom domain and on username.github.io/repo/.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
