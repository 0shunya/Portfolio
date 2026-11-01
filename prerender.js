// Writes the rendered page into dist/index.html so it reads without JavaScript.
import fs from 'node:fs'
import { render } from './dist-ssr/entry-server.js'

const file = new URL('./dist/index.html', import.meta.url)
const html = fs.readFileSync(file, 'utf8').replace('<!--app-html-->', render())
fs.writeFileSync(file, html)
fs.rmSync(new URL('./dist-ssr', import.meta.url), { recursive: true, force: true })
console.log('prerendered dist/index.html')
