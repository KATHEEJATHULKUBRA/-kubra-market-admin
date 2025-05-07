
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    process.env.NODE_ENV !== 'production' ? require('autoprefixer') : null
  ].filter(Boolean)
}