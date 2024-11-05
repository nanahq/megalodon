module.exports = {
  content: ['/**/*.{ts,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.5rem',
      '3xl': '1.5rem',
    },
    extend: {
      colors: {
        nana: {
          primary: "#469ADC",
          secondary: "#2C3E50",
          red: "#f652a0",
          yellow: "#f1cf54"
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
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
        'body': "16px",
        'body-semibold': "27px",
        'body-bold': "80px",
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
