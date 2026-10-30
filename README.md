# Portfolio

A personal site for a designer or developer: a counted preloader, an oversized
name, a services marquee, a selected-work grid with parallax, an about page,
rotating testimonials and a contact form. Built with Vite, React, Tailwind and
Motion, and deployed to GitHub Pages as plain static files.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Make it yours

- [src/data/site.ts](src/data/site.ts) is the whole site: name, role, location,
  email, socials, projects, services, testimonials and experience. Images live
  in `public/images`; each project has one cover and the case-study page crops
  it for detail shots.
- [src/app/pages](src/app/pages) holds the three pages and
  [src/app/components](src/app/components) the shared pieces.
- [src/styles.css](src/styles.css) holds the design tokens: paper canvas, ink
  text, one electric accent, Bricolage Grotesque for display type.
- `index.html` holds the page title and description used by search engines and
  link previews.

Motion respects `prefers-reduced-motion`, and the preloader runs once per tab.

## The contact form

GitHub Pages cannot run server code, so the form posts directly to a form
service. Web3Forms is wired up by default (free, 250 submissions a month):

1. Create an access key at [web3forms.com](https://web3forms.com).
2. Paste it into `form.key` in [src/data/site.ts](src/data/site.ts).

Formspree also works: set `form.provider` to `'formspree'` and put the id from
`https://formspree.io/f/<id>` into `form.key`. Until a key is set, the Send
button opens the visitor's mail app with the message filled in, so the form is
never a dead end. A hidden honeypot field filters most bots.

## Deploy on GitHub Pages

The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
builds on every push to `main` and publishes `dist/` to Pages.

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The site appears at `https://<user>.github.io/<repo>/`.

The workflow picks the correct base path automatically: `/<repo>/` for a
project page, `/` when the repo contains `public/CNAME`.

## Custom domain

1. Add your domain in **Settings → Pages → Custom domain** (this writes a
   `CNAME` file into the repo) or commit `public/CNAME` yourself with the bare
   hostname, e.g. `yourname.com`.
2. At your DNS provider, point the apex at GitHub Pages with `A` records to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`, and `www` at `<user>.github.io` with a `CNAME` record.
3. Tick **Enforce HTTPS** once the certificate is issued.

If the CNAME file is added after the first deploy, push any commit so the build
runs again with the new base path.
