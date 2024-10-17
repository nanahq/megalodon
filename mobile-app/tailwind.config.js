module.exports = {
  content: ['/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nana: {
          primary: "#469ADC",
          secondary: "#2C3E50",
          red: "#DC3545",
          green: "#28A745"
        },
        primary: {
          50: "#ecf7fd",
          100: '#469ADC',
          200: '#DFE5E7',
          300: '#a3dbac',
          400: '#7fcd8b',
          500: '#00C2E8',
          600: '#41a550',
          700: '#32803e',
          800: '#32803e',
          900: '#16371b',
        },
        'brand-ash': '#EEEEEE'
      },
      fontsize: {
        'nana-text': 10,
        'nana-subheading': 20,
        'nana-heading': 30
      },
    borderWidth: {
      0.5: 0.5,
      1.5: 1.5,
    },
      borderRadius: {
        5: 5,
        40: 50
      }
    },
  },
}
