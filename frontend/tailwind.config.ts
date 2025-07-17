import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "float-gentle": {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(10px, -10px)' },
        },
        "float-gentle-reverse": {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-10px, -10px)' },
        },
        "wave-slow": {
          '0%, 100%': { transform: 'translateX(0) skew-y-6' },
          '50%': { transform: 'translateX(-20%) skew-y-6' },
        },
        "wave-slow-reverse": {
          '0%, 100%': { transform: 'translateX(0) skew-y-3' },
          '50%': { transform: 'translateX(20%) skew-y-3' },
        },
        "gradient-slow": {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        "glow-slow": {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        "bounce-slow": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'float-gentle': 'float-gentle 15s ease-in-out infinite',
        'float-gentle-reverse': 'float-gentle-reverse 18s ease-in-out infinite',
        'wave-slow': 'wave-slow 20s ease-in-out infinite',
        'wave-slow-reverse': 'wave-slow-reverse 25s ease-in-out infinite',
        'gradient-slow': 'gradient-slow 10s ease-in-out infinite',
        'glow-slow': 'glow-slow 15s linear infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;