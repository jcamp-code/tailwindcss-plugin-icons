import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import plugin = require('tailwindcss/plugin')
import type { PluginCreator } from 'tailwindcss/types/config'
import type { IconsOptions } from './types'

export const defaultConfig = {
  scale: 1.2,
  mode: 'auto',
  prefix: 'i-',
  warn: false,
  collections: null,
  extraCssProperties: { display: 'inline-block', 'vertical-align': 'middle' },
  customizations: {},
  autoInstall: false,
  unit: 'em',
} as Partial<IconsOptions>

export function createPluginIcons(options: IconsOptions = {}): PluginCreator {
  function getCSS(value: string, mode: string) {
    // eslint-disable-next-line n/prefer-global/buffer
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

const pluginIcons = plugin.withOptions<IconsOptions>((options) => {
  return createPluginIcons(options)
})

module.exports = pluginIcons
