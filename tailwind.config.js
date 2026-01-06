/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // 关键！扫描根目录下的 App.tsx, index.tsx
    "./components/**/*.{js,ts,jsx,tsx}", // 关键！扫描 components 文件夹
    "./pages/**/*.{js,ts,jsx,tsx}"      // 关键！扫描 pages 文件夹
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
