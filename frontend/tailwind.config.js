/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // We will use class based dark mode toggle
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
                },
                dark: {
                    bg: '#0f1117',
                    card: '#1e2130',
                    border: 'rgba(255,255,255,0.08)',
                    text: '#f0f2ff',
                    muted: '#8b90a7'
                },
                light: {
                    bg: '#f8fafc',
                    card: '#ffffff',
                    border: '#e2e8f0',
                    text: '#0f172a',
                    muted: '#64748b'
                }
            }
        },
    },
    plugins: [],
}
