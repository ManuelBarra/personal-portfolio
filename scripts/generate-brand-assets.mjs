import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const BG = '#03060d'
const NEON = '#3DDCFF'

// Terminal-prompt glyph — "> _" — matches the CLI-prompt motif used in HeroRoom.
function iconSvg(size) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="${BG}"/>
  <rect x="4" y="4" width="92" height="92" fill="none" stroke="${NEON}" stroke-opacity="0.35" stroke-width="3"/>
  <path d="M30 26 L60 50 L30 74" fill="none" stroke="${NEON}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="66" y="64" width="16" height="11" fill="${NEON}"/>
</svg>`.trim()
}

// Same glyph as the favicon, but centered with extra padding and no square
// border — the About room clips this into a circle via CSS (which already
// has its own neon ring), so the glyph needs room to survive that crop.
function avatarSvg(size) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="${BG}"/>
  <path d="M36 32 L58 50 L36 68" fill="none" stroke="${NEON}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="62" y="59" width="14" height="10" fill="${NEON}"/>
</svg>`.trim()
}

function ogSvg() {
  const gridLines = []
  for (let x = 0; x <= 1200; x += 30) {
    gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="${NEON}" stroke-opacity="0.07"/>`)
  }
  for (let y = 0; y <= 630; y += 30) {
    gridLines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${NEON}" stroke-opacity="0.07"/>`)
  }

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  ${gridLines.join('\n  ')}
  <rect x="18" y="18" width="1164" height="594" fill="none" stroke="${NEON}" stroke-opacity="0.3" stroke-width="2"/>

  <path d="M120 245 L190 315 L120 385" fill="none" stroke="${NEON}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="215" y="300" width="26" height="18" fill="${NEON}"/>

  <text x="290" y="300" font-family="Consolas, 'Courier New', monospace" font-size="64" font-weight="700" fill="#E8ECF4" letter-spacing="2">malb.dev</text>
  <text x="291" y="350" font-family="Consolas, 'Courier New', monospace" font-size="26" fill="${NEON}" letter-spacing="1">Manuel Barra Lazo — Frontend Web Developer</text>
  <text x="291" y="385" font-family="Consolas, 'Courier New', monospace" font-size="20" fill="#8892A8" letter-spacing="1">malb.dev</text>
</svg>`.trim()
}

async function main() {
  // App-router file-convention icons (auto-wired into <head> by Next.js)
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(ROOT, 'src', 'app', 'icon.png'))
  await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(ROOT, 'src', 'app', 'apple-icon.png'))

  const ogBuffer = await sharp(Buffer.from(ogSvg())).png().toBuffer()
  await fs.writeFile(path.join(ROOT, 'src', 'app', 'opengraph-image.png'), ogBuffer)
  await fs.writeFile(path.join(ROOT, 'src', 'app', 'twitter-image.png'), ogBuffer)

  // Manifest icons (referenced by path from app/manifest.ts)
  const iconsDir = path.join(ROOT, 'public', 'icons')
  await fs.mkdir(iconsDir, { recursive: true })
  await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(iconsDir, 'icon-192.png'))
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(iconsDir, 'icon-512.png'))

  // AboutRoom avatar (replaces the real photo)
  await sharp(Buffer.from(avatarSvg(512))).png().toFile(path.join(ROOT, 'public', 'avatar.png'))

  console.log('brand assets generated')
}

main()
