/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : "class",
  content: [
    "./app/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./components/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./utils/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./*.{html,js,jsx,ts,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  important: "html",
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator|gray|orange)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary|default)|(bg|border|text|stroke|fill)-(white|black)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "hsl(228, 78%, 71%)",
          light: "hsl(227, 85%, 79%)",
          dark: "hsl(228, 63%, 56%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          default: "hsl(40, 90%, 53%)",
          light: "hsl(42, 96%, 73%)",
          foreground: "hsl(220, 14%, 4%)",
        },
        tertiary: {
          default: "hsl(266, 48%, 48%)",
          light: "hsl(277, 55%, 81%)",
          dark: "hsl(271, 31%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        error: {
          default: "hsl(0, 84%, 60%)",
        },
        success: {
          default: "hsl(160, 84%, 39%)",
        },
        warning: {
          default: "hsl(40, 90%, 53%)",
        },
        info: {
          default: "hsl(217, 91%, 60%)",
        },
        typography: {
          white: "hsl(0, 0%, 100%)",
          gray: "hsl(0, 0%, 83%)",
          black: "hsl(300, 2%, 9%)",
        },
        outline: {},
        background: {
          error: "hsl(var(--color-background-error)/<alpha-value>)",
          warning: "hsl(var(--color-background-warning)/<alpha-value>)",
          muted: "hsl(var(--color-background-muted)/<alpha-value>)",
          success: "hsl(var(--color-background-success)/<alpha-value>)",
          info: "hsl(var(--color-background-info)/<alpha-value>)",
          light: "hsl(0, 0%, 98%)",
          dark: "hsl(270, 4%, 9%)",
          default: "hsl(220, 20%, 97%)",
          surface: "hsl(0, 0%, 100%)",
        },
        text: {
          main: "hsl(220, 14%, 4%)",
          muted: "hsl(215, 19%, 35%)",
          inverse: "hsl(220, 14%, 96%)",
        },
        indicator: {
          primary: "hsl(var(--color-indicator-primary)/<alpha-value>)",
          info: "hsl(var(--color-indicator-info)/<alpha-value>)",
          error: "hsl(var(--color-indicator-error)/<alpha-value>)",
        },
        pitch: "hsl(347, 77%, 50%)",
        gray: {
          300: "hsl(216, 12%, 84%)",
          500: "hsl(220, 9%, 46%)",
          default: "hsl(218, 11%, 65%)",
        },
        orange: {
          400: "hsl(27, 96%, 61%)",
          500: "hsl(25, 95%, 53%)",
          600: "hsl(21, 90%, 48%)",
          default: "hsl(25, 95%, 53%)",
        },
        white: "hsl(0, 0%, 100%)",
        black: "hsl(0, 0%, 0%)",

        border: "hsl(213, 27%, 84%)",
      },
      fontFamily: {
        heading: ["Nunito_700Bold"],
        "heading-extra": ["Nunito_800ExtraBold"],
        body: ["OpenSans_400Regular"],
        "body-bold": ["OpenSans_600SemiBold"],
      },
      fontSize: {
        "tiny-xs": ["10px", "14px"],
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "26px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
        "jp-md": ["22px", "32px"],
        "jp-lg": ["28px", "40px"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
};
