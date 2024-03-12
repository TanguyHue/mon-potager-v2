/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/flowbite/**/*.js',
    './resources/**/*.edge',
    './resources/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      spacing: {
        '180px': '180px',
        '148px': '148px',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
}
