<script>
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <div>
    <ClientOnly>
      <Toaster position="top-right" richColors />
    </ClientOnly>

    <div
      class="flex items-center justify-center py-4 bg-green-50 gap-6 shadow-lg fixed top-0 left-0 right-0"
    >
      <img src="/favicon.ico" alt="logo" class="w-10 h-10" />

      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
      >
        Home
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
      >
        Product
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
      >
        About us
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
      >
        Contact us
      </div>
    </div>

    <div class="pt-8 container mx-auto">
      <NuxtLayout>
        <!-- <ClientOnly> -->
        <NuxtPage />
        <!-- </ClientOnly> -->
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
