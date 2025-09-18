<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first();
});
</script>

<template>
  <div>
    <h1>{{ page?.title }}</h1>

    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
