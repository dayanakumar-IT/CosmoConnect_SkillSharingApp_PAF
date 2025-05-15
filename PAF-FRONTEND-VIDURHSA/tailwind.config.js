/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          space: {
            dark: '#0B0D17', // Deep space
            navy: '#181D31', // Night sky
            purple: '#3E1F92', // Cosmic purple
            blue: '#104987', // Distant galaxy blue
            teal: '#0A7373', // Nebula teal
            accent: '#7B2CBF', // Vibrant cosmic accent
          },
          star: {
            yellow: '#FFCD3C', // Star light
            white: '#F8F9FA', // Starlight
          }
        },
        fontFamily: {
          nasa: ['Orbitron', 'sans-serif'],
          space: ['Space Mono', 'monospace'],
          sans: ['Roboto', 'sans-serif'],
        },
        backgroundImage: {
          'space-gradient': 'linear-gradient(to right, #0B0D17, #181D31, #0B0D17)',
          'nebula': 'linear-gradient(to right, #3E1F92, #7B2CBF)',
        },
      },
    },
    plugins: [],
  }