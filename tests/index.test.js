const path = require('path')
const iconsPlugin = require('../dist/index.js')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

function run(config, css = '@tailwind components', plugin = tailwindcss) {
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

  return run(config).then(result => {
    const icon = String.raw`--tw-icon`
    const width = String.raw`width: 1em;
    height: 1em`

    expect(result.css).toContain(icon)
    expect(result.css).toContain(width)
  })
})

it('makesIconWithSlash', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add]"></div>` }],
  }

  return run(config).then(result => {
    const icon = String.raw`--tw-icon`
    const width = String.raw`width: 1em;
    height: 1em`

    expect(result.css).toContain(icon)
    expect(result.css).toContain(width)
  })
})

it('ignoresBadIcons', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-ad]"></div>` }],
  }

  return run(config).then(result => {
    const icon = String.raw`--tw-icon`

    expect(result.css).toEqual(expect.not.stringContaining(icon))
  })
})

it('makesBgIcon', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-bg-[carbon-add]"></div>` }],
  }

  return run(config).then(result => {
    const icon = String.raw`--tw-icon`
    const bg = String.raw`background: url("data:image/svg+`

    expect(result.css).toEqual(expect.not.stringContaining(icon))
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

  return run(config).then(result => {
    const width = String.raw`width: 1px;
    height: 1px`
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

  return run(config).then(result => {
    const width = String.raw`width: 1.2em;
    height: 1.2em`
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

  return run(config).then(result => {
    const width = String.raw`width: 20px;
    height: 20px`
    expect(result.css).toContain(width)
  })
})

it('makesCustomIcon', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[custom-icon1]"></div>` }],
    icons: {
      jsonCollections: {
        custom: 'json/custom-collection.json',
      },
    },
  }

  return run(config).then(result => {
    const icon = String.raw`--tw-icon`
    const width = String.raw`width: 1em;
    height: 1em`
    expect(result.css).toContain(icon)
    expect(result.css).toContain(width)
  })
})

it('usesScaleOverride', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/2]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 2em;
    height: 2em`
    expect(result.css).toContain(width)
  })
})

it('usesScaleOverrideDecimal', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/2.5]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 2.5em;
    height: 2.5em`
    expect(result.css).toContain(width)
  })
})

it('usesScaleOverrideUnits', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/24px]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 24px;
    height: 24px`
    expect(result.css).toContain(width)
  })
})

it('usesScaleOverrideUnitsRem', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/2rem]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 2rem;
    height: 2rem`
    expect(result.css).toContain(width)
  })
})

it('usesScaleOverrideUnitsWithDash', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon-add/24px]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 24px;
    height: 24px`
    expect(result.css).toContain(width)
  })
})

it('ignoresBadScaleOverrides', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/2-4px]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 1.2em;
    height: 1.2em`
    expect(result.css).toContain(width)
  })
})

it('ignoresBadUnitOverrides', () => {
  const config = {
    content: [{ raw: String.raw`<div class="i-[carbon/add/24dpi]"></div>` }],
    icons: {
      scale: 1.2,
    },
  }

  return run(config).then(result => {
    const width = String.raw`width: 1.2em;
    height: 1.2em`
    expect(result.css).toContain(width)
  })
})
