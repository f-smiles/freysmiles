/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      
      rotate: {
        '2': '2deg',
        '-2': '-2deg',
        '5': '5deg',
        '-5': '-5deg',
        '15': '15deg',
        '18':'18deg',
        fontFamily: {
          sans: ['Lato', 'sans-serif'],
        },
      }
    }
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    fontFamily: {
      'aileron':"Aileron-Black",
      'cera': "CeraProRegular",
      'horizon':"HorizonSolid",
      'horizonOutline':"HorizonOutline",
      "anton":"Anton-Regular",
      "grandslang":"GrandSlang-Roman",
      "saol":"SaolDisplay-Regular",
      'helvetica-neue':"HelveticaNeue-Medium",
      'helvetica-neue-light':"HelveticaNeue-Light",
      'monument':"MonumentExtended-Regular",
      'nimbus':"NimbusSanL-Reg",
      'oakes-medium':"Oakes-Grotesk-Medium",
      'oakes-regular':"Oakes-Regular",
      'Lato':'Lato',
      'TerminaTest-Bold':"TerminaTest-Bold",
      'iCiel-Gotham-Ultra':"iCiel-Gotham-Ultra",
      'poppins':"Poppins",
      'didot': "Didot",
      'geomanist':"Geomanist-Regular",
      'Chaney-Ultra':"Chaney-Ultra",
      'novela-regular': "NovelaRegular",
      'cera-bold': "CeraProBold",
      'neue-montreal': "NeueMontrealBook",
      'neue-montreal-medium': "NeueMontrealMedium",
      'altero': "Altero",
      'altero-outline': "Altero Outline",
      'helvetica-now-thin': "Helvetica Now Thin",
      'larken': "Larken",
      'saol':'SaolDisplay-Regular',
      'larken-italic': "Larken Italic",
      'editorial-new': "Editorial New",
      'agrandir-bold': "Agrandir Bold",
      'agrandir-grandheavy': "Agrandir Grand Heavy",
    },
    extend: {
      fontSize: {
        'display-xs': '24px', // 1.5rem
        'display-sm': '30px', // 1.875rem
        'display-md': '36px', // 2.25rem
        'display-lg': '48px', // 3rem
        'display-xl': '60px', // 3.75rem
        'display-2xl': '72px', // 4.5rem
      },
      lineHeight: {
        'display-xs': '32px', // 2rem
        'display-sm': '38px', // 2.375rem
        'display-md': '44px', // 2.75rem
        'display-lg': '60px', // 3.75rem
        'display-xl': '72px', // 4.5rem
        'display-2xl': '90px', // 5.625rem
      },
      colors: {
        'primary': {
          0: '#000000',
          10: '#2c0051',
          20: '#470c7a',
          25: '#531d85',
          30: '#5f2b92',
          35: '#6b389e',
          40: '#7845ac',
          50: '#925fc7',
          60: '#ad79e3',
          70: '#c994ff',
          80: '#dcb8ff',
          90: '#f0dbff',
          95: '#f9ecff',
          98: '#fff7fe',
          99: '#fffbff',
          100: '#ffffff',
        },
        'secondary': {
          0: '#000000',
          10: '#3e0022',
          20: '#640039',
          25: '#780046',
          30: '#8c0053',
          35: '#a20060',
          40: '#b4136d',
          50: '#d53587',
          60: '#f751a1',
          70: '#ff82b8',
          80: '#ffb0cd',
          90: '#ffd9e4',
          95: '#ffecf1',
          98: '#fff8f8',
          99: '#fffbff',
          100: '#ffffff',
          'custom-seafoam': '#c2d6d6',
          'custom-green': '#bccdcdv',
          'custom-seafoam-green':"#c0d3d3"
          
        },
      },
      keyframes: {
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [
    require('postcss-import'), // Handles @import directives
    require('autoprefixer'),
    require('tailwindcss'), // Tailwind CSS framework
    require('tailwindcss/nesting'), // Handles CSS nesting
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
    require('tw-elements/dist/plugin.cjs'),
    require('@tailwindcss/forms'),

  ],
}
