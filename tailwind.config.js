/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  extand: {
    FontFace: {
      Hack: ['Hack', 'mono'],
    }
  },
  theme: {
    fontFamily: {
      mono: ['Hack'],
    },
  },
  plugins: [],
}
