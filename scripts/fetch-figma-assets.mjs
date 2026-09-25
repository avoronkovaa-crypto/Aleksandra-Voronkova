#!/usr/bin/env node
/**
 * Downloads every image fill used by the prototype straight from the Figma file
 * and stores it as an optimised WebP in public/assets/<hash8>.webp.
 *
 *   FIGMA_TOKEN=<personal access token> npm run fetch-assets
 *
 * Create a token in Figma → Settings → Security → Personal access tokens
 * (scope: "File content: read-only").
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(join(root, 'scripts/figma-assets.json'), 'utf8'))
const outDir = join(root, 'public/assets')
const token = process.env.FIGMA_TOKEN
const force = process.argv.includes('--force')

if (!token) {
  console.error('Missing FIGMA_TOKEN. Usage: FIGMA_TOKEN=xxxx npm run fetch-assets')
  process.exit(1)
}

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('`sharp` not installed — images will be saved without resizing.')
}

const res = await fetch(`https://api.figma.com/v1/files/${manifest.fileKey}/images`, {
  headers: { 'X-Figma-Token': token },
})
if (!res.ok) {
  console.error(`Figma API error ${res.status}: ${await res.text()}`)
  process.exit(1)
}
const { meta } = await res.json()
const urls = meta.images

await mkdir(outDir, { recursive: true })

let done = 0
const queue = [...manifest.images]
async function worker() {
  while (queue.length) {
    const hash = queue.shift()
    const file = join(outDir, `${hash.slice(0, 8)}.webp`)
    if (!force) {
      try {
        await access(file)
        done++
        continue
      } catch {
        /* not downloaded yet */
      }
    }
    const url = urls[hash]
    if (!url) {
      console.warn(`! no URL for ${hash}`)
      continue
    }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    const out = sharp
      ? await sharp(buf)
          .resize({ width: manifest.maxWidth, withoutEnlargement: true })
          .webp({ quality: 82, alphaQuality: 90 })
          .toBuffer()
      : buf
    await writeFile(file, out)
    done++
    console.log(`✓ ${hash.slice(0, 8)}  ${(out.length / 1024).toFixed(0)} KB  (${done}/${manifest.images.length})`)
  }
}
await Promise.all(Array.from({ length: 6 }, worker))
console.log(`Done — ${done} images in public/assets`)
