/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // LOC brand palette — matches design system
        'loc-orange':  '#e2611d',
        'loc-teal':    '#609d92',
        'loc-cobalt':  '#3b6bdc',
        'loc-pink':    '#e6224f',
        'loc-black':   '#1a1410',   // warm off-black — never use plain #000 for text
        'loc-white':   '#f7f3ee',   // warm off-white — never use plain #fff for ground
        'loc-bg2':     '#f5f4f0',
        'loc-bg-dark': '#1a1208',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'helvetica', 'sans-serif'],
        mono:    ['"Space Mono"', '"SF Mono"', 'Menlo', 'monospace'],
      },
      fontWeight: {
        hairline:   '200',
        thin:       '250',
        extralight: '300',
      },
      letterSpacing: {
        'display':  '-1.72px',
        'h1':       '-0.96px',
        'h2':       '-0.26px',
        'body':     '-0.14px',
        'mono':     '0.54px',
        'mono-sm':  '0.60px',
      },
      borderRadius: {
        pill: '50px',
      },
      boxShadow: {
        // Override Tailwind defaults to match design system
        sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        lg: '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
      },
      maxWidth: {
        content: '1200px',
        reading: '680px',
      },
      screens: {
        xs:  '560px',
        sm:  '640px',
        md:  '768px',
        lg:  '960px',
        xl:  '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
