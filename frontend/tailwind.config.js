/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // 启用基于class的暗色模式
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#a5b4fc',
        },
        surface: {
          DEFAULT: '#f9fafb',
          dark: '#1f2937',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      screens: {
        'xs': '475px',
        // 确保完整的响应式断点
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

