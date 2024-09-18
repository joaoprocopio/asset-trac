import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

export default defineConfig(() => {
  return {
    plugins: [react(), svgr()],
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
  }
})
