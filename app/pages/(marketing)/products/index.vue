<script setup lang="ts">
import LazyProducts from "~/products/LazyProducts.vue";
import type { ProductResponse } from "~/types/product.types";

definePageMeta({
  title: "Products",
});

useHead({
  title: "Products",
  meta: [
    {
      name: "description",
      content: "Products",
    },
  ],

  link: [
    {
      rel: "canonical",
      href: "https://www.google.com",
    },
  ],
});

useSeoMeta({
  title: "Products",
  description: "Products",
  ogTitle: "Products",
  ogDescription: "Products",
  ogImage: "https://www.google.com",
  ogUrl: "https://www.google.com",
  ogSiteName: "Products",
  ogType: "website",
  ogLocale: "en_US",
  ogLocaleAlternate: "en_US",
});

// const route = useRoute();

// console.log(route.meta.title); // My home page

// const { $apiFetch } = useNuxtApp();

// const { data, error, refresh, clear, execute, pending, status } =
//   await $apiFetch<ProductResponse>("/products", {
//     method: "GET",

//   });

// console.log({ data, error, refresh, clear, execute, pending, status });
</script>

<template>
  <div>
    <LazyProducts :hydrate-after="500" />
  </div>
</template>
