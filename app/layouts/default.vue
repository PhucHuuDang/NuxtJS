<script setup lang="ts">
import Navbar from "~/components/common/Navbar.vue";
</script>

<template>
  <div class="w-full h-full">
    <Navbar />
    <main>
      <div class="pt-20">
        <slot />
      </div>
    </main>

    <!-- <footer>Footer</footer> -->
  </div>
</template>
