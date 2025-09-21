<script setup lang="ts">
import UserAuth from "../user/UserAuth.vue";
import ShoppingBag from "./ShoppingBag.vue";

const routePath = useRoute();

const router = [
  {
    name: "Home",
    path: "/",
    icon: "home",
  },
  {
    name: "Products",
    path: "/products",
    icon: "products",
  },
  {
    name: "About us",
    path: "/about",
    icon: "about",
  },
  {
    name: "Contact us",
    path: "/contact",
    icon: "contact",
  },
];
</script>

<template>
  <header>
    <div
      class="flex items-center justify-center py-4 bg-green-50 gap-6 shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <img src="/favicon.ico" alt="logo" class="w-10 h-10" />

      <div
        :class="route.path === routePath.fullPath ? 'bg-slate-200' : ''"
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
        v-for="route in router"
        :key="route.path"
        @click="navigateTo(route.path)"
      >
        {{ route.name }}
      </div>

      <!-- <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
        @click="navigateTo('/')"
      >
        Home
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
        @click="navigateTo('/products')"
      >
        Products
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
        @click="navigateTo('/about')"
      >
        About us
      </div>
      <div
        class="cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition duration-300"
        @click="navigateTo('/contact')"
      >
        Contact us
      </div> -->
      <ShoppingBag />

      <UserAuth />
    </div>
  </header>
</template>
