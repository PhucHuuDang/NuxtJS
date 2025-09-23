<script lang="ts" setup>
import { ShoppingBagIcon, Trash2Icon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { currentUser } from "~/axios-actions/auth";

import { usd } from "~/lib/currency";

const carts = useCartStore();

const isShow = ref<boolean>(false);

watch(
  () => currentUser(),
  async (newAuth) => {
    const data = await newAuth;

    isShow.value = !!data?.user;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <Sheet>
    <SheetTrigger as-child v-if="isShow">
      <div
        class="hover:bg-slate-400/50 cursor-pointer rounded-full bg-slate-200/50 p-2 transition duration-200 hover:scale-105"
      >
        <ShoppingBagIcon class="size-5" />
      </div>
    </SheetTrigger>

    <SheetContent
      class="mr-0 min-w-full rounded-none md:mr-3 md:min-w-[800px] md:rounded-4xl p-2"
    >
      <SheetHeader class="flex items-center justify-center">
        <SheetTitle>Shopping Bag</SheetTitle>
        <SheetDescription>
          <div class="flex justify-between text-sm text-slate-600">
            <span>{{ carts?.cart?.totalProducts }} products</span>
            <span>{{ carts?.cart?.totalQuantity }} items</span>
          </div>
        </SheetDescription>
      </SheetHeader>

      <!-- Product list -->
      <div class="mt-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        <div
          v-for="p in carts.cart?.products"
          :key="p.id"
          class="flex items-center gap-4 border-b pb-4"
        >
          <LazyNuxtImg
            :src="p.thumbnail"
            :alt="p.title"
            class="w-20 h-20 rounded-lg object-cover"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-slate-800">{{ p.title }}</h3>
            <p class="text-sm text-slate-500">
              {{ p.quantity }} × {{ usd(p.price.toFixed(2)) }}
            </p>
            <p class="text-sm text-green-600 font-medium">
              = {{ usd(p.discountedTotal.toFixed(2)) }}
            </p>
          </div>
          <Trash2Icon
            class="size-5 mr-2 text-slate-400 hover:text-red-500 cursor-pointer"
            @click="carts.removeProduct(p.id)"
          />
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-6 border-t pt-4 flex flex-col gap-2 text-right">
        <div class="flex justify-between text-sm text-slate-600 font-semibold">
          <span>Subtotal</span>
          <span>{{ usd(carts.cart?.total?.toFixed(2) || 0) }}</span>
        </div>
        <div class="flex justify-between text-sm text-slate-600 font-semibold">
          <span>Discounted</span>
          <span class="text-green-600 font-semibold">
            {{ usd(carts.cart?.discountedTotal?.toFixed(2) || 0) }}
          </span>
        </div>
        <button
          class="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          Checkout
        </button>
      </div>
    </SheetContent>
  </Sheet>
</template>
