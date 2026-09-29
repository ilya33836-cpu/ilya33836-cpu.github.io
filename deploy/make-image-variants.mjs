/**
 * Генерация адаптивных версий скриншотов: 160/320/640/960 рядом с основной 1600px.
 * Запуск: node deploy/make-image-variants.mjs
 */
import { readdir, stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const source = join(root, 'public', 'projects')

const WIDTHS = [160, 320, 640, 960]
// Уже сгенерированный вариант: имя заканчивается на -(160|320|640|960).webp
const GENERATED = /-(160|320|640|960)\.webp$/

const files = (await readdir(source)).filter(
  (name) => name.toLowerCase().endsWith('.webp') && !GENERATED.test(name),
)

if (files.length === 0) {
  console.log('Исходных WebP-файлов не найдено, нечего оптимизировать')
  process.exit(0)
}

let added = 0
for (const name of files) {
  const input = join(source, name)
  for (const width of WIDTHS) {
    const target = input.replace(/\.webp$/i, `-${width}.webp`)
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(target)
    added += (await stat(target)).size
  }
}

console.log(`\nОбработано ${files.length} файлов, добавлено ${files.length * WIDTHS.length} вариантов (${(added / 1024 / 1024).toFixed(2)} МБ)`)
