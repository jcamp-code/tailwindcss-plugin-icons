import type { IconifyLoaderOptions } from '@iconify/utils/lib/loader/types'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'
import type { IconsOptions } from './types'
import { loader } from './loader'

// Tailwind does not support async plugins
// So my workaround is to load icon in a worker process with spawnSync
// credit: https://github.com/InfiniteXyy/tailwindcss-iconify/

const COLLECTION_NAME_PARTS_MAX = 3
const iconName = process.argv[2]
if (!iconName) process.exit(0)

const modeOverride = process.argv[3] as 'def' | 'bg' | 'auto' | 'mask'
if (!modeOverride) process.exit(0)

const options = JSON.parse(process.argv[4]) as IconsOptions

const {
  scale = 1,
  prefix = 'i-',
  warn = false,
  collections: customCollections,
  extraProperties = {},
  customizations = {},
  autoInstall = false,
  unit,
} = options

let { mode = 'auto' } = options

if (modeOverride !== 'def') {
  mode = modeOverride
}

const loaderOptions: IconifyLoaderOptions = {
  addXmlNs: true,
  scale,
  customCollections,
  autoInstall,
  // avoid warn from @iconify/loader: we'll warn below if not found
  warn: undefined,
  customizations: {
    ...customizations,
    additionalProps: { ...extraProperties },
    trimCustomSvg: true,
    async iconCustomizer(collection, icon, props) {
      await customizations.iconCustomizer?.(collection, icon, props)
      if (unit) {
        if (!props.width) props.width = `${scale}${unit}`
        if (!props.height) props.height = `${scale}${unit}`
      }
    },
  },
}

let iconLoader = loader(options)

let collection = ''
let name = ''
let svg: string | undefined

const usedProps = {}

async function generateCSS(value: any) {
  const parts = value.split(/-/g)
  for (let i = COLLECTION_NAME_PARTS_MAX; i >= 1; i--) {
    collection = parts.slice(0, i).join('-')
    name = parts.slice(i).join('-')
    svg = await iconLoader(collection, name, { ...loaderOptions, usedProps })

    if (svg) break
  }

  if (!svg) {
    if (warn) console.warn('[tw-icons]', `failed to load icon "${value}"`)
    return
  }
  const url = `url("data:image/svg+xml;utf8,${encodeSvgForCss(svg)}")`

  if (mode === 'auto') mode = svg.includes('currentColor') ? 'mask' : 'bg'

  if (mode === 'mask') {
    // Thanks to https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images
    return {
      '--tw-icon': url,
      mask: 'var(--tw-icon) no-repeat',
      'mask-size': '100% 100%',
      '-webkit-mask': 'var(--tw-icon) no-repeat',
      '-webkit-mask-size': '100% 100%',
      'background-color': 'currentColor',
      ...usedProps,
    }
  } else {
    return {
      background: `${url} no-repeat`,
      'background-size': '100% 100%',
      'background-color': 'transparent',
      ...usedProps,
    }
  }
}

generateCSS(iconName).then(result => process.stdout.write(JSON.stringify(result)))
