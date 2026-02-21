export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',
        secondary: '#f59e0b',
        ink: '#0f172a',
        surface: '#f8fafc',
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        glow: '0 12px 36px rgba(15, 118, 110, 0.18)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 20% 20%, rgba(15,118,110,0.22), transparent 55%), radial-gradient(circle at 80% 0%, rgba(245,158,11,0.18), transparent 40%), linear-gradient(135deg, #f0fdfa 0%, #ffffff 45%, #fff7ed 100%)',
      },
    },
  },
  plugins: [],
}
