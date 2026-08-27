/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 暖纸白底色，营造"书"的安宁感
        paper: '#FAF8F3',
        surface: '#FEFDFB',
        // 墨色文字
        ink: '#211E1A',
        muted: '#6B6358',
        faint: '#9A9186',
        // 细发丝边框
        line: '#E8E1D5',
        // 克制强调色：深靛蓝（AI / 可信 / 行动）
        accent: '#3B3A6E',
        'accent-hover': '#2C2B54',
        'accent-soft': '#EEEDF6',
        // 暖琥珀（仅用于章节/页码等"书"的标签，少量）
        amber: '#B5793A',
        'amber-soft': '#F6EEDD',
        // 引用高亮
        mark: '#FBEFC0',
        'mark-border': '#E4C95A',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Songti SC', 'STSong', 'serif'],
        sans: ['Inter', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(33,30,26,0.04), 0 8px 24px rgba(33,30,26,0.05)',
        drawer: '-12px 0 40px rgba(33,30,26,0.12)',
      },
      borderRadius: {
        card: '12px',
      },
      maxWidth: {
        reading: '720px',
        shell: '1080px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pulse-soft': 'pulse-soft 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
