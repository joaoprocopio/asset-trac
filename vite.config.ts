import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

export default defineConfig(() => {
  return {
    plugins: [react(), svgr()],
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
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL("./index.html", import.meta.url)),
          404: fileURLToPath(new URL("./public/404.html", import.meta.url)),
        },
      },
    },
  }
})
