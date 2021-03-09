module.exports = {
  purge: ['./src/**/*.md', './_includes/**/*.liquid'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ]
}