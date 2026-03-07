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
          default: "#7B92EF",
          light: "#9CB0F7",
          dark: "#4A67D6",
          foreground: "#FFFFFF",
        },
        secondary: {
          default: "#F3AB1B",
          light: "#FCD376",
          foreground: "#090A0C",
        },
        tertiary: {
          default: "#7440B6",
          light: "#d4b3e9",
          dark: "#8e6ab0",
          foreground: "#FFFFFF",
        },
        error: {
          default: "#EF4444",
        },
        success: {
          default: "#10B981",
        },
        warning: {
          default: "#f3ab1b",
        },
        info: {
          default: "#3B82F6",
        },
        typography: {
          white: "#FFFFFF",
          gray: "#D4D4D4",
          black: "#181718",
        },
        outline: {},
        background: {
          error: "rgb(var(--color-background-error)/<alpha-value>)",
          warning: "rgb(var(--color-background-warning)/<alpha-value>)",
          muted: "rgb(var(--color-background-muted)/<alpha-value>)",
          success: "rgb(var(--color-background-success)/<alpha-value>)",
          info: "rgb(var(--color-background-info)/<alpha-value>)",
          light: "#FBFBFB",
          dark: "#181719",
          default: "#F6F7F9",
          surface: "#FFFFFF",
        },
        text: {
          main: "#090a0c",
          muted: "#475569",
          inverse: "#F3F4F6",
        },
        indicator: {
          primary: "rgb(var(--color-indicator-primary)/<alpha-value>)",
          info: "rgb(var(--color-indicator-info)/<alpha-value>)",
          error: "rgb(var(--color-indicator-error)/<alpha-value>)",
        },
        pitch: "#E11D48",
        gray: {
          300: "#D1D5DB",
          500: "#6B7280",
          default: "#9CA3AF",
        },
        orange: {
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          default: "#F97316",
        },
        white: "#FFFFFF",
        black: "#000000",

        border: "#cbd5e1",
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
