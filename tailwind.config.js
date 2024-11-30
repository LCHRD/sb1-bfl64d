/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'text-green-500',
    'text-emerald-500',
    'text-blue-500',
    'text-yellow-500',
    'text-orange-500',
    'text-red-500',
    'text-red-700',
    'bg-green-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-red-700'
  ]
};