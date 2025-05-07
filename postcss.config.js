
// postcss.config.js (ESM)
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const plugins = [
  tailwindcss,
  process.env.NODE_ENV !== 'production' ? autoprefixer : null
].filter(Boolean);

export default {
  plugins
};
