# Changelog

## [0.5.0] - 2023-04-02

### - Renamed `extraProperties` to `extraCssProperties`

### - Changed default `extraCssProperties` to `{display: inline-block, 'vertical-align': 'middle'}` from `{}`

### - Changed default size to `1.2em` from `1.0em`

## [0.4.0] - 2022-08-30

### - Enabled scaling to be passed to the plugin - `carbon/add/24px` or `carbon-add/24px`

## [0.3.0] - 2022-08-28

### - Added custom JSON collections using the jsonCollections property

### - Enabled `/` as a collection and name divider (`carbon/add`). Unfortunately, Tailwind CSS won't pass `carbon:add` correctly.

## [0.2.0] - 2022-08-13

### - Moved icons to component layer

    This is more accurate and also allows them to be auto sorted at the beginning of the class list by the official class name sorter

## [0.1.0] - 2022-08-12

Initial release!
