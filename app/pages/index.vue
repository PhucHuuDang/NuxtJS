<script setup lang="ts">
import LazyProducts from "~/products/LazyProducts.vue";

useHead({
  title: "Home",
  meta: [
    {
      name: "description",
      content: "Home",
    },
  ],
});
</script>

<template>
  <div>
    <LazyProducts :hydrate-after="500" />
  </div>
</template>
