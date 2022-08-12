import type { UniversalIconLoader } from '@iconify/utils/lib/loader/types'
import type { IconsOptions } from './types'
import { loadIcon } from '@iconify/utils'

export const isNode = typeof process < 'u' && typeof process.stdout < 'u' && !process.versions.deno
export const isVSCode = isNode && !!process.env.VSCODE_CWD

function createNodeLoader() {
  return require('@iconify/utils/lib/loader/node-loader.cjs').loadNodeIcon
}

function combineLoaders(loaders: UniversalIconLoader[]) {
  return <UniversalIconLoader>((...args) => {
    for (const loader of loaders) {
      const result = loader(...args)
      if (result) return result
    }
  })
}

export function loader(options: IconsOptions = {}): UniversalIconLoader {
  const loaders: UniversalIconLoader[] = []
  if (isNode && !isVSCode) loaders.push(createNodeLoader())
  loaders.push(loadIcon)
  return combineLoaders(loaders)
}
