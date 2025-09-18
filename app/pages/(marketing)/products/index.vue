<script setup lang="ts">
import LazyProducts from "~/products/LazyProducts.vue";

definePageMeta({
  title: "Products",
});

// const route = useRoute();

// console.log(route.meta.title); // My home page
</script>

<template>
  <div>
    <LazyProducts :hydrate-after="500" />
  </div>
</template>
