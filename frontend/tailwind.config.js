/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#080C16",
          card: "#0D1424",
          cardHover: "#111B30",
          cardBorder: "#1C2A47",
          panel: "#0A101D",
          input: "#0B1322",
        },
        brand: {
          blue: "#2563EB",
          cyan: "#06B6D4",
          purple: "#7C3AED",
          pink: "#EC4899",
          emerald: "#10B981",
          amber: "#F59E0B",
          glow: "#3B82F6"
        }
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
