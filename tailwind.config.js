import { withUt } from "uploadthing/tw"

/** @type {import('tailwindcss').Config} */
module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
  	fontFamily: {
  		aileron: 'Aileron-Black',
		autumnchant: 'Autumn Chant',
  		cera: 'CeraProRegular',
  		horizon: 'HorizonSolid',
  		horizonOutline: 'HorizonOutline',
  		anton: 'Anton-Regular',
  		grandslang: 'GrandSlang-Roman',
  		saol: 'SaolDisplay-Regular',
  		'helvetica-neue': 'HelveticaNeue-Medium',
  		'helvetica-neue-light': 'HelveticaNeue-Light',
  		monument: 'MonumentExtended-Regular',
  		nimbus: 'NimbusSanL-Reg',
  		novela: 'Novela-Regular',
  		'oakes-medium': 'Oakes-Grotesk-Medium',
  		'oakes-regular': 'Oakes-Regular',
  		Lato: 'Lato',
  		'TerminaTest-Bold': 'TerminaTest-Bold',
  		'iCiel-Gotham-Ultra': 'iCiel-Gotham-Ultra',
  		poppins: 'Poppins',
  		didot: 'Didot',
  		geomanist: 'Geomanist-Regular',
  		'Chaney-Ultra': 'Chaney-Ultra',
  		'novela-regular': 'NovelaRegular',
  		'cera-bold': 'CeraProBold',
  		'neue-montreal': 'NeueMontrealBook',
  		'neue-montreal-medium': 'NeueMontrealMedium',
  		altero: 'Altero',
  		'altero-outline': 'Altero Outline',
  		'helvetica-now-thin': 'Helvetica Now Thin',
  		larken: 'Larken',
  		'larken-italic': 'Larken Italic',
  		'editorial-new': 'Editorial New',
  		'editorial-new-italic': 'Editorial New Italic',
  		'agrandir-bold': 'Agrandir Bold',
  		'agrandir-grandheavy': 'Agrandir Grand Heavy',
  		nautica: 'Nautica',
  		drayton: 'Drayton'
  	},
  	extend: {
  		fontSize: {
  			'display-xs': '24px',
  			'display-sm': '30px',
  			'display-md': '36px',
  			'display-lg': '48px',
  			'display-xl': '60px',
  			'display-2xl': '72px'
  		},
  		lineHeight: {
  			'display-xs': '32px',
  			'display-sm': '38px',
  			'display-md': '44px',
  			'display-lg': '60px',
  			'display-xl': '72px',
  			'display-2xl': '90px'
  		},
  		rotate: {
  			'2': '2deg',
  			'5': '5deg',
  			'15': '15deg',
  			'18': '18deg',
  			'-2': '-2deg',
  			'-5': '-5deg',
  			fontFamily: {
  				sans: ["Lato", "sans-serif"]
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				'0': '#000000',
  				'10': '#2c0051',
  				'20': '#470c7a',
  				'25': '#531d85',
  				'30': '#5f2b92',
  				'35': '#6b389e',
  				'40': '#7845ac',
  				'50': '#925fc7',
  				'60': '#ad79e3',
  				'70': '#c994ff',
  				'80': '#dcb8ff',
  				'90': '#f0dbff',
  				'95': '#f9ecff',
  				'98': '#fff7fe',
  				'99': '#fffbff',
  				'100': '#ffffff',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'0': '#000000',
  				'10': '#3e0022',
  				'20': '#640039',
  				'25': '#780046',
  				'30': '#8c0053',
  				'35': '#a20060',
  				'40': '#b4136d',
  				'50': '#d53587',
  				'60': '#f751a1',
  				'70': '#ff82b8',
  				'80': '#ffb0cd',
  				'90': '#ffd9e4',
  				'95': '#ffecf1',
  				'98': '#fff8f8',
  				'99': '#fffbff',
  				'100': '#ffffff',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				'custom-seafoam': '#c2d6d6',
  				'custom-green': '#bccdcdv',
  				'custom-seafoam-green': '#c0d3d3'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			slideDown: {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			slideUp: {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  			slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)'
  		}
  	}
  },
  plugins: [
    require("postcss-import"), // Handles @import directives
    require("autoprefixer"),
    require("tailwindcss"), // Tailwind CSS framework
    require("tailwindcss/nesting"), // Handles CSS nesting
    require('@tailwindcss/aspect-ratio'),
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
    require("tw-elements/dist/plugin.cjs"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
});
