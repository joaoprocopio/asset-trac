import react from "@vitejs/plugin-react"
import postcssNesting from "postcss-nesting"
import { fileURLToPath, URL } from "url"
import { defineConfig } from "vite"

export default defineConfig(() => {
  return {
    plugins: [react()],
    base: "/assets-trac/",
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [postcssNesting],
      },
    },
  }
})
