const path = require('path')
const iconsPlugin = require('../dist/index.js')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

function run(config, css = '@tailwind utilities', plugin = tailwindcss) {
  let { currentTestName } = expect.getState()
  config = {
    ...{
      plugins: [iconsPlugin(config.icons)],
      corePlugins: {
        preflight: false,
      },
    },
    ...config,
  }

  return postcss(plugin(config)).process(css, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

it('makesIcon', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add]"></div>` }],
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const h1 = String.raw`--tw-icon`
    const width = String.raw`width: 1em; height: 1em`

    expect(result.css).toContain(h1)
    expect(result.css).toContain(width)
  })
})

it('makesIcon', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add]"></div>` }],
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const h1 = String.raw`--tw-icon`

    expect(result.css).toContain(h1)
  })
})

it('ignoresBadIcons', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-ad]"></div>` }],
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const h1 = String.raw`--tw-icon`

    expect(result.css).toEqual(expect.not.stringContaining(h1))
  })
})

it('makesBgIcon', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-bg-[carbon-add]"></div>` }],
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const h1 = String.raw`--tw-icon`
    const bg = String.raw`background: url("data:image/svg+`

    expect(result.css).toEqual(expect.not.stringContaining(h1))
    expect(result.css).toContain(bg)
  })
})

it('usesUnits', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add]"></div>` }],
    icons: {
      unit: 'px',
    },
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const width = String.raw`width: 1px; height: 1px`
    expect(result.css).toContain(width)
  })
})

it('usesScale', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const width = String.raw`width: 1.2em; height: 1.2em`
    expect(result.css).toContain(width)
  })
})

it('usesScaleAndUnits', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add]"></div>` }],
    icons: {
      scale: 20,
      unit: 'px',
    },
  }

  return run(config, '@tailwind base; @tailwind utilities').then(result => {
    const width = String.raw`width: 20px; height: 20px`
    expect(result.css).toContain(width)
  })
})
