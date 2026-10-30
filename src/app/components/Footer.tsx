import { ArrowUpRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { form as formConfig, site } from '../../data/site'
import { Lines, Magnetic, Reveal } from './motion'
import { useLocalTime } from './Nav'

// GitHub Pages is static, so the form talks to a form service directly. The
// endpoint is derived from `form` in src/data/site.ts so the component never
// needs editing.
function endpoint() {
  if (!formConfig.key) return ''
  return formConfig.provider === 'web3forms' ? 'https://api.web3forms.com/submit' : `https://formspree.io/f/${formConfig.key}`
}

export function Footer() {
  const time = useLocalTime()
  const [fields, setFields] = useState({ name: '', email: '', message: '', botcheck: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'mailto' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (fields.botcheck) return

    const url = endpoint()
    if (!url) {
      // No form service connected yet: hand the message to the mail app so the
      // form still does something useful.
      const subject = encodeURIComponent(`Enquiry from ${fields.name || site.name}`)
      const body = encodeURIComponent(`${fields.message}\n\n${fields.name}\n${fields.email}`)
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setState('mailto')
      return
    }

    setState('sending')
    try {
      const payload =
        formConfig.provider === 'web3forms'
          ? {
              access_key: formConfig.key,
              subject: `Portfolio enquiry from ${fields.name}`,
              name: fields.name,
              email: fields.email,
              message: fields.message,
              botcheck: false,
            }
          : { name: fields.name, email: fields.email, message: fields.message }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Form service rejected the submission')
      setState('done')
    } catch {
      setState('error')
      setError(`That did not go through. You can email me directly at ${site.email}.`)
    }
  }

  const field = 'h-14 w-full rounded-control border border-line-strong bg-transparent px-5 text-[15px] placeholder:text-faint transition-colors focus:border-fg focus:outline-none'

  return (
    <footer id="contact" className="mt-32 border-t border-line sm:mt-44">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <Lines as="h2" className="font-display text-[clamp(48px,8vw,120px)]" lines={['Let’s make', <>something <span className="text-accent">good</span></>]} />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Magnetic>
                <a href={`mailto:${site.email}`} className="inline-flex h-14 items-center gap-2 rounded-[16px] bg-fg px-7 text-[16px] font-medium text-bg transition-colors hover:bg-[#2b2925]">
                  {site.email}
                  <ArrowUpRight className="size-4" />
                </a>
              </Magnetic>
              <p className="text-[14px] text-muted">
                {site.available ? 'Taking on projects for next quarter' : 'Fully booked at the moment'}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            {state === 'done' ? (
              <div className="flex h-full min-h-[320px] flex-col justify-center rounded-card bg-surface-2/60 p-8">
                <p className="font-display text-[36px]">Thank you</p>
                <p className="mt-2 text-[15px] text-muted">I read everything myself and reply within two days.</p>
              </div>
            ) : state === 'mailto' ? (
              <div className="flex h-full min-h-[320px] flex-col justify-center rounded-card bg-surface-2/60 p-8">
                <p className="font-display text-[36px]">One more step</p>
                <p className="mt-2 text-[15px] text-muted">
                  Your mail app should have opened with the message filled in. If it did not, write to{' '}
                  <a href={`mailto:${site.email}`} className="link-draw text-fg">
                    {site.email}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required placeholder="Your name" aria-label="Your name" className={field} value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} />
                  <input required type="email" placeholder="Email" aria-label="Your email" className={field} value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} />
                </div>
                <textarea
                  required
                  placeholder="A few words about the project"
                  aria-label="A few words about the project"
                  className={`${field} h-auto min-h-[140px] resize-none py-4`}
                  value={fields.message}
                  onChange={(e) => setFields({ ...fields, message: e.target.value })}
                />
                {/* Honeypot: bots fill this, people never see it. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute left-[-9999px] size-px opacity-0"
                  value={fields.botcheck}
                  onChange={(e) => setFields({ ...fields, botcheck: e.target.value })}
                />
                <button type="submit" disabled={state === 'sending'} className="h-14 rounded-control border border-fg text-[15px] font-medium transition-colors hover:bg-fg hover:text-bg disabled:opacity-50">
                  {state === 'sending' ? 'Sending…' : 'Send'}
                </button>
                {state === 'error' && <p className="text-[13px] text-accent">{error}</p>}
                {!endpoint() && (
                  <p className="text-[13px] text-faint">
                    No form service connected yet, so Send opens your mail app. Add a Web3Forms key in src/data/site.ts to deliver in place.
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>

        <div className="mt-24 grid gap-8 border-t border-line pt-8 text-[14px] sm:grid-cols-3">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-draw text-muted transition-colors hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-faint sm:text-center">
            {site.location}, {time}
          </p>
          <p className="text-faint sm:text-right">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
