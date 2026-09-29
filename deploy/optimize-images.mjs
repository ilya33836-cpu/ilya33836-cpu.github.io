/**
 * Оптимизация скриншотов проектов: PNG -> WebP с ограничением по ширине.
 * Запуск: npx --yes -p sharp node deploy/optimize-images.mjs
 */
import { readdir, rename, mkdir, stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const source = join(root, 'public', 'projects')
const backup = join(root, 'screenshots-original')

const WIDTH = 1600
const QUALITY = 78

const files = (await readdir(source)).filter((name) => name.toLowerCase().endsWith('.png'))
if (files.length === 0) {
  console.log('PNG-файлов нет, нечего оптимизировать')
  process.exit(0)
}

const sizeOf = async (name) => (await stat(join(source, name))).size
let before = 0
for (const name of files) before += await sizeOf(name)

await mkdir(backup, { recursive: true })

let after = 0
for (const name of files) {
  const base = name.replace(/\.png$/i, '')
  const target = join(source, `${base}.webp`)

  await sharp(join(source, name))
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(target)

  after += (await stat(target)).size
  await rename(join(source, name), join(backup, name))
  console.log(`${name} -> ${base}.webp`)
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1)
console.log(`\nГотово: ${mb(before)} МБ -> ${mb(after)} МБ`)
console.log(`Оригиналы: screenshots-original/`)
