const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const colors = require('tailwindcss/colors');
const { join } = require('path');

// add: 'src/app/pages/**/*.{js,ts,jsx,tsx}' because createGlobPatternsForDependencies doesn't check all files
// from https://blog.nrwl.io/setup-next-js-to-use-tailwind-with-nx-849b7e21d8d0
module.exports = {
  purge: [
    join(__dirname, 'src/app/pages/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFBEBE',
          DEFAULT: '#020644',
          dark: '#a1616a',
        },
        muted: colors.gray,
      },
    },
    fontFamily: {
      header: ['Days one', 'roboto'],
      body: ['anonymous', 'verdana'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
