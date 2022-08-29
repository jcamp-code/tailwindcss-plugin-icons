import plugin = require('tailwindcss/plugin')
import type { IconsOptions } from './types'
import type { PluginCreator } from 'tailwindcss/types/config'
import { spawnSync } from 'child_process'
import { resolve } from 'path'

export const defaultConfig = {
  scale: 1,
  mode: 'auto',
  prefix: 'i-',
  warn: false,
  collections: null,
  extraProperties: {},
  customizations: {},
  autoInstall: false,
  unit: 'em',
} as Partial<IconsOptions>

export function createPluginIcons(options: IconsOptions = {}): PluginCreator {
  function getCSS(value: string, mode: string) {
    let options64 = Buffer.from(JSON.stringify(options)).toString('base64')

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
      [_prefix + '-bg']: (value: string) => getCSS(value, 'bg'),
      [_prefix + '-auto']: (value: string) => getCSS(value, 'auto'),
      [_prefix + '-mask']: (value: string) => getCSS(value, 'mask'),
    })
  }
}

const pluginIcons = plugin.withOptions<IconsOptions>(function (options) {
  return createPluginIcons(options)
})

module.exports = pluginIcons
