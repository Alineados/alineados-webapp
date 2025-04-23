import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				'alineados-blue': {
					// 50: '#A8B9CC',
					// 100: '#92A8C2',
					// 200: '#7C97B8',
					// 300: '#6686AE',
					// 400: '#5E7B9E',
					// 500: '#5E7B9E',
					// 600: '#293855',
					// 700: '#222D47',
					// 800: '#1C2539',
					// 900: '#1B2533'
					50:  '#E7E8EA',
					100: '#D1D3D6',
					200: '#BABDC1',
					300: '#A3A7AD',
					400: '#8C9198',
					500: '#5F6670',
					600: '#293855',
					700: '#49515C',
					800: '#323B47',
					900: '#1B2533'
				},
				'alineados-orange': {
					// 50: '#FCF1EB',
					// 100: '#FAE4D7',
					// 200: '#F8D6C2',
					// 300: '#F5C8AE',
					// 400: '#F2BB9A',
					// 500: '#F0AD86',
					// 600: '#EE9F72',
					// 700: '#EB915D',
					// 800: '#E88449',
					// 900: '#E67635'
					50:  '#FFFCFA',
					100: '#FFFAF5',
					200: '#FFF5EB',
					300: '#FFF0D6',
					400: '#FFEBBF',
					500: '#FFE599',
					600: '#FFDF73',
					700: '#FFD94D',
					800: '#FFD426',
					900: '#F8CA03'
				},
				'alineados-green': {
					// 50:  '#E0F0E3',
					// 100: '#C5E0CA',
					// 200: '#AAD0B1',
					// 300: '#8FC399',
					// 400: '#75B582',
					// 500: '#65A772',
					// 600: '#569362',
					// 700: '#487F52',
					// 800: '#3A6B42',
					// 900: '#2C5732'
					50:  '#F7FAF3',
					100: '#EFF4E8',
					200: '#DFEFD1',
					300: '#CFE9B4',
					400: '#BFEE97',
					500: '#AFE17A',
					600: '#9FEC5D',
					700: '#8FE640',
					800: '#7FE022',
					900: '#6FD904'
				},
				'alineados-gray': {
					// 50: '#F7F7F7',
					// 100: '#E1E1E1',
					// 200: '#CFCFCF',
					// 300: '#B1B1B1',
					// 400: '#9E9E9E',
					// 500: '#7E7E7E',
					// 600: '#626262',
					// 700: '#515151',
					// 800: '#3B3B3B',
					// 900: '#222222'
					50:  '#FAFAFA',
					100: '#F0F0F0',
					200: '#E5E5E5',
					300: '#DADADA',
					400: '#CACACA',
					500: '#BABABA',
					600: '#AAAAAA',
					700: '#9A9A9A',
					800: '#8A8A8A',
					900: '#7A7A7A'
				},
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			// borderRadius: {
			// 	xl: 'calc(var(--radius) + 4px)',
			// 	lg: 'var(--radius)',
			// 	md: 'calc(var(--radius) - 2px)',
			// 	sm: 'calc(var(--radius) - 4px)'
			// },
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'border-blink': {
					'0%,70%,100%': { borderColor: 'rgb(249 115 22 / 1)' },
					'20%,50%': { borderColor: 'rgb(249 115 22 / 0)' }
				},
				'border-cursor-blink': {
					'0%, 100%': { borderColor: 'rgb(249 115 22)' },
					'50%': { borderColor: 'transparent' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'border-blink': 'border-blink 1.25s ease-out infinite',
				'border-cursor-blink': 'border-cursor-blink 1.3s steps(1) infinite',
			}
		}
	},
	plugins: [tailwindcssAnimate]
};

export default config;
