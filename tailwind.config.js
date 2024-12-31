/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5DD3',
        secondary: '#7B61FF',
        accent: '#8B5CF6',
        background: '#0A0118',
        'surface-dark': '#12081F',
        'card-background': '#160A2C',
        'text-primary': '#FFFFFF',
        'text-secondary': '#E2E8F0',
        'text-muted': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(108, 93, 211, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropFilter: {
        'glass': 'blur(4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(to bottom right, #6C5DD3, #8B5CF6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
