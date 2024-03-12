/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/flowbite/**/*.js',
    './resources/**/*.edge',
    './resources/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {},
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
}
