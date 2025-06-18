const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.ts.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    safelist: [
        'md:w-1/3','lg:w-1/3','xl:w-1/3',
        'md:w-1/4','lg:w-1/4','xl:w-1/4',
        'md:w-1/5','lg:w-1/5','xl:w-1/5',
        
    ],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                black: colors.black,
                white: colors.white,
                emerald: colors.emerald,
                indigo: colors.indigo,
                yellow: colors.yellow,
                stone: colors.warmGray,
                sky: colors.lightBlue,
                neutral: colors.trueGray,
                gray: colors.coolGray,
                slate: colors.blueGray,
                primary: "#3BB54A",
                red: "#EE0034"
            },
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1600px',
            '4xl': '1900px',
            'ord-md': '1120px',
            'ord-stock-move-md': '1010px',
            'ord-switch-shop-md': '620px'
        },
    },
    plugins: [],
}

