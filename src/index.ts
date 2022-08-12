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
    const { stderr, stdout } = spawnSync('node', [
      resolve(__dirname, './worker'),
      value,
      mode,
      JSON.stringify(options),
    ])
    // console.log('getcss: ' + value + '?' + mode)
    const svg = String(stdout)
    const err = String(stderr)
    if (err) {
      // console.error(`[tw-icons]: ${err}`)
      return {}
    }

    // console.log(svg)
    return JSON.parse(svg)
  }

  return function ({ matchUtilities }) {
    const _prefix = (options?.prefix || 'i-').replace(/-$/, '')

    matchUtilities({
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
