<script setup lang="ts">
import type { Product } from "@/types/product.types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-vue-next";

const props = defineProps<{
  product: Product;
}>();
</script>

<template>
  <Card
    class="max-w-sm overflow-hidden cursor-pointer rounded-2xl shadow-lg transition hover:shadow-xl"
    :key="product.id"
    @click="navigateTo(`/products/${product.id}`)"
  >
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="h-48 w-full object-cover"
    />

    <CardHeader>
      <CardTitle class="text-lg font-semibold">{{ product.title }}</CardTitle>
      <p class="text-sm text-muted-foreground">{{ product.brand }}</p>
    </CardHeader>

    <CardContent>
      <p class="line-clamp-2 text-sm text-gray-600">
        {{ product.description }}
      </p>

      <div class="mt-3 flex items-center gap-2">
        <span class="text-lg font-bold">${{ product.price }}</span>
        <Badge variant="secondary" class="text-xs">
          -{{ product.discountPercentage }}%
        </Badge>
      </div>

      <div class="mt-2 flex items-center gap-1 text-yellow-500">
        <StarIcon
          v-for="i in 5"
          :key="i"
          :class="
            i <= Math.round(product.rating) ? 'fill-yellow-500' : 'opacity-30'
          "
          class="h-4 w-4"
        />
        <span class="ml-1 text-sm text-muted-foreground">{{
          product.rating.toFixed(1)
        }}</span>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <Badge v-for="tag in product.tags" :key="tag" variant="outline">{{
          tag
        }}</Badge>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between items-center">
      <span
        :class="[
          'text-sm font-medium',
          product.stock > 0 ? 'text-green-600' : 'text-red-500',
        ]"
      >
        {{ product.stock > 0 ? "In Stock" : "Out of Stock" }}
      </span>

      <Button
        size="sm"
        variant="outline"
        class="cursor-pointer hover:bg-slate-200 transition duration-200"
        >Add to Cart</Button
      >
    </CardFooter>
  </Card>
</template>
