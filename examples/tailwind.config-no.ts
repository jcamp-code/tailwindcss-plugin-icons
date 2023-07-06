import type { Config } from 'tailwindcss'
import iconsPlugin from '../dist/index'

export default <Partial<Config>>{
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [iconsPlugin({ scale: 1.5 })],
}
