import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#14181C",
        element: "#435666",
        green: "#00E054",
        blue: "#41BCF4",
        orange: "#FF8001",
        text: "#FFFFFF",
      },
    },
  },
  plugins: [],
} satisfies Config;
