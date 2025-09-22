<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});

useSeoMeta({
  title: "Contact",
  description: "Contact us",
  ogTitle: "Contact",
  ogDescription: "Contact us",
  ogImage: "/favicon.ico",
  ogUrl: "harrydang.vercel.app",
  ogType: "website",
  ogLocale: "en_US",
  ogSiteName: "Hue",
});
</script>

<template>
  <div>
    <h1>Contact</h1>
  </div>
</template>
