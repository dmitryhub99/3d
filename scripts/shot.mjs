// Render the app in headless Chromium at the 1440×1024 design canvas.
//
//   node scripts/shot.mjs                       build, then shoot every state at 1x
//   node scripts/shot.mjs --states people,jobs  only those states
//   node scripts/shot.mjs --scale 2             high-res (2880×2048)
//   node scripts/shot.mjs --crops               also save 2x crops of the People regions
//   node scripts/shot.mjs --no-build            reuse the existing dist/
//   node scripts/shot.mjs --out shots/tmp       output directory (default shots/)
//
// The app reads ?section=…, ?palette=1 and ?inspector=0 to boot into a state.
import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : fallback
}

const STATES = [
  { name: 'people', query: 'section=people' },
  { name: 'people-hover', query: 'section=people', hover: '[data-row-index="3"]' },
  { name: 'people-palette', query: 'section=people&palette=1' },
  { name: 'people-no-inspector', query: 'section=people&inspector=0' },
  { name: 'feed', query: 'section=home' },
  { name: 'jobs', query: 'section=jobs' },
  { name: 'profile', query: 'section=profile' },
  { name: 'hiring', query: 'section=hiring' },
  { name: 'companies', query: 'section=companies' },
  { name: 'projects', query: 'section=projects' },
  { name: 'applications', query: 'section=applications' },
  { name: 'saved', query: 'section=saved' },
  { name: 'activity', query: 'section=activity' },
]

// 2x detail crops of the People workspace, [x, y, w, h] in CSS px
const CROPS = {
  'crop-nav-header': [0, 0, 720, 360],
  'crop-list': [0, 0, 1000, 1024],
  'crop-inspector': [900, 0, 540, 1024],
  'crop-inspector-lower': [900, 480, 540, 544],
}

const only = opt('states')?.split(',')
const scale = Number(opt('scale', '1'))
const out = opt('out', 'shots')
mkdirSync(out, { recursive: true })

if (!flag('no-build')) execSync('npx vite build --logLevel warn', { stdio: 'inherit' })

const server = await preview({ preview: { port: 4317, strictPort: false }, logLevel: 'warn' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: scale })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

for (const s of STATES.filter((s) => !only || only.includes(s.name))) {
  await page.goto(`${base}?${s.query}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (s.hover) await page.hover(s.hover).catch(() => errors.push(`hover target missing: ${s.hover}`))
  await page.waitForTimeout(900) // let entrance motion settle
  const suffix = scale === 1 ? '' : `@${scale}x`
  await page.screenshot({ path: `${out}/${s.name}${suffix}.png` })
  console.log(`✓ ${out}/${s.name}${suffix}.png`)
}

if (flag('crops')) {
  const hi = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 2 })
  await hi.goto(`${base}?section=people`, { waitUntil: 'networkidle' })
  await hi.evaluate(() => document.fonts.ready)
  await hi.waitForTimeout(900)
  for (const [name, [x, y, width, height]] of Object.entries(CROPS)) {
    await hi.screenshot({ path: `${out}/${name}.png`, clip: { x, y, width, height } })
    console.log(`✓ ${out}/${name}.png`)
  }
}

if (errors.length) console.log('\nBrowser errors:\n' + [...new Set(errors)].join('\n'))
await browser.close()
server.httpServer.close()
