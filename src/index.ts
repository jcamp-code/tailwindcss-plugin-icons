import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import plugin from 'tailwindcss/plugin'
import type { PluginCreator } from 'tailwindcss/types/config'
import type { IconsOptions } from './types'

function createPluginIcons(options: IconsOptions = {}): PluginCreator {
  function getCSS(value: string, mode: string) {
    const options64 = Buffer.from(JSON.stringify(options)).toString('base64')

    const { stderr, stdout } = spawnSync('node', [
      resolve(__dirname, './worker'),
      value,
      mode,
      options64,
    ])

    const svg = String(stdout)
    const err = String(stderr)
    if (err) {
      if (options.warn ?? false) console.error(`[tw-icons]: ${err}`)
      return {}
    }

    return JSON.parse(svg)
  }

  return function ({ matchComponents }) {
    const _prefix = (options.prefix || 'i-').replace(/-$/, '')

    matchComponents({
      [_prefix]: (value: string) => getCSS(value, 'def'),
      [`${_prefix}-bg`]: (value: string) => getCSS(value, 'bg'),
      [`${_prefix}-auto`]: (value: string) => getCSS(value, 'auto'),
      [`${_prefix}-mask`]: (value: string) => getCSS(value, 'mask'),
    })
  }
}

export default plugin.withOptions<IconsOptions>((options) => {
  return createPluginIcons(options)
})
