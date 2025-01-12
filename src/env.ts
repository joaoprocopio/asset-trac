export const env = {
  get PROD() {
    return import.meta.env.MODE === "production"
  },
}
