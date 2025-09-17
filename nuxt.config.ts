import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["shadcn-nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    // componentDir: "./components/ui",

    componentDir: "./app/components/ui",
    // componentDir: "~/app/components/ui",
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
      duration: 150,
    },

    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://dummyjson.com",
    },
  },
});
