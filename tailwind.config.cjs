/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend:{
      colors: {
        'ssmbluenight':'#05285A',
        'ssmblue800':'#0D336A',
        'ssmbluedark':'#173E78',
        'ssmblue600':'#244A83',
        'ssmblue':'#34568B',
        'ssmblue400':'#42669D',
        'ssmblue300':'#5176AE',
        'ssmblue200':'#6287BD',
        'ssmblue100':'#7498CB',

      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      mono: ['Consolas','monospace']
    }
  },
  plugins: [],
}
