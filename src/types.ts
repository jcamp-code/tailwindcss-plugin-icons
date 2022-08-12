import type {
  CustomIconLoader,
  IconCustomizations,
  InlineCollection,
} from '@iconify/utils/lib/loader/types'
import type { IconifyJSON } from '@iconify/types'

export type Awaitable<T> = T | Promise<T>

export interface IconsOptions {
  /**
   * Scale related to the current font size (1em).
   *
   * @default 1
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
   * @default {}
   */
  extraProperties?: Record<string, string>
  /**
   * Emit warning when missing icons are matched
   *
   * @default false
   */
  warn?: boolean
  /**
   * In Node.js environment, the preset will search for the installed iconify dataset automatically.
   * When using in the browser, this options is provided to provide dataset with custom loading mechanism.
   */
  collections?: Record<
    string,
    (() => Awaitable<IconifyJSON>) | undefined | CustomIconLoader | InlineCollection
  >
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
