<script lang="ts" setup>
import { ShoppingBagIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { currentUser } from "~/axios-actions/auth";
import {
  getCartByUser,
  type GetCartByUserResponse,
} from "~/axios-actions/cart";

const { carts, error, limit, skip, total } =
  (await getCartByUser()) as GetCartByUserResponse;

const user = await currentUser();

const isShow = ref<boolean>(false);

if (error) {
  toast.error(error);
}

if (carts) {
  console.log(carts);
}

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
      class="mr-0 min-w-full rounded-none md:mr-3 md:min-w-[800px] md:rounded-4xl"
    >
      <SheetHeader class="flex items-center justify-center">
        <SheetTitle>Shopping Bag</SheetTitle>
        <SheetDescription>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <span> Wish you a happy shopping! </span>
            </div>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
