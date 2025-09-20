<script setup lang="ts">
import type { NuxtError } from "#app";
import { FileText } from "lucide-vue-next";
import EmptyState from "./components/common/EmptyState.vue";
import { Home, Search, ShoppingCart } from "lucide-vue-next";
const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });

console.log(props.error);
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50 p-6">
    <EmptyState
      title="No Products Found"
      :description="`Have something wrong with status ${error?.statusCode} ${error?.statusMessage}`"
      :icons="[Home, Search, ShoppingCart]"
      :action="{ label: 'Add Product', onClick: handleError }"
    />
  </div>
</template>
