module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      width: {
        "sidebar": '250px',
      },
      translate: {
        '2x': '200%',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      translate: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [],
}
