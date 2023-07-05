import type { IconCustomizations } from '@iconify/utils/lib/loader/types'

export type Awaitable<T> = T | Promise<T>

export interface IconsOptions {
  /**
   * Scale related to the current font size (1em).
   *
   * @default 1.2
   */
  scale?: number
  /**
   * Mode of generated CSS icons.
   *
   * - `mask` - use background color and the `mask` property for monochrome icons
   * - `bg` - use background image for the icons, colors are static
   * - `auto` - smartly decide mode between `mask` and `background-img` per icon based on its style
   *
   * @default 'auto'
   * @see https://antfu.me/posts/icons-in-pure-css
   */
  mode?: 'mask' | 'bg' | 'auto'
  /**
   * Class prefix for matching icon rules.
   *
   * @default `i-`
   */
  prefix?: string
  /**
   * Extra CSS properties applied to the generated CSS
   *
   * @default "{display: inline-block, 'vertical-align': 'middle'}"
   *
   */
  extraCssProperties?: Record<string, string>
  /**
   * Emit warning when missing icons are matched
   *
   * @default false
   */
  warn?: boolean
  /**
   * JSON icon files to be loaded, allows use of Font Awesome Pro (eg fa-pro-duotone)
   *
   * @default {}
   */
  jsonCollections?: Record<string, string>
  /**
   * In Node.js environment, the preset will search for the installed iconify dataset automatically.
   * When using in the browser, this options is provided to provide dataset with custom loading mechanism.
   */
  // doesn't currently work with tailwind plugin due to only using in node worker limitations
  // collections?: Record<
  //   string,
  //   (() => Awaitable<IconifyJSON>) | undefined | CustomIconLoader | InlineCollection
  // >
  /**
   * Custom icon customizations.
   */
  customizations?: Omit<IconCustomizations, 'additionalProps' | 'trimCustomSvg'>
  /**
   * Auto install icon sources package when the usages is detected
   *
   * **WARNING**: only on `node` environment, on `browser` this option will be ignored.
   *
   * @default false
   */
  autoInstall?: boolean
  /**
   * Custom icon unit.
   *
   * @default `em`
   */
  unit?: string
}
