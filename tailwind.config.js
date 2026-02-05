/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#D4A373",
                "primary-dark": "#b08558",
                "background-light": "#FFFCF9",
                "background-alt": "#FFF5F5",
                "text-main": "#333333",
                "text-light": "#666666",
                "border-color": "#E5E5E5",
                "surface-light": "#FFFFFF",
                "surface-dark": "#292524",
                "accent-light": "#F9F4F2",
                "accent-decorative": "#EACEC2",
            },
            fontFamily: {
                display: ["Lora", "serif"],
                body: ["Lato", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0px",
                xl: "0.5rem",
            },
            letterSpacing: {
                widest: "0.2em",
                "super-wide": "0.3em",
            },
        },
    },
    plugins: [],
}
