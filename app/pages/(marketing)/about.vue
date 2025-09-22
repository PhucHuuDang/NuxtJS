<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});

useSeoMeta({
  title: "About",
  description: "About us",
  ogTitle: "About",
  ogDescription: "About us",
  ogImage: "/favicon.ico",
  ogUrl: "harrydang.vercel.app",
  ogType: "website",
  ogLocale: "en_US",
  ogSiteName: "Hue",
});
</script>

<template>
  <NuxtWelcome />
</template>
