/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        // SwiftDrop brand colors (Blue-inspired)
        'swift-blue': {
          50: '#eff6ff',
          100: '#dbeafe', // Light blue message bubble color
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary blue
          600: '#2563eb', // Medium blue
          700: '#1d4ed8', // Secondary blue
          800: '#1e40af',
          900: '#1e3a8a', // Dark blue (header)
          950: '#172554',
        },
        'swift-neutral': {
          50: '#f8fafc',
          100: '#f1f5f9', // Light gray-blue chat background
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

      },
      boxShadow: {
        'swift': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
        'swift-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'swift-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'pulse-custom': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-custom': 'bounce 2s infinite',
        'spin-custom': 'spin 1s linear infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/hero-pattern.svg')",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: '#1d4ed8',
              '&:hover': {
                color: '#1e3a8a',
              },
            },
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  safelist: [
    // Add specific classes that might be dynamically generated
    {
      pattern: /bg-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /from-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /to-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /via-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /border-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /text-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /shadow-(swift-blue|swift-neutral)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /bg-(blue|gray)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-slide-in-right',
    'animate-pulse-custom',
    'animate-bounce-custom',
    'animate-spin-custom',
    'animate-ping',
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
  ],
  plugins: [],
}