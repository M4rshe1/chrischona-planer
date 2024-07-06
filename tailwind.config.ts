import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    plugins: [
        require("daisyui"),
    ],
    daisyui: {
        themes: [
            {
                dark: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    primary: "#9d2328",
                },
                light: {
                    ...require("daisyui/src/theming/themes")["light"],
                    primary: "#9d2328",
                },
            }
        ],
    },
    darkMode: ['class', '[data-theme="dark"]']
};
export default config;
