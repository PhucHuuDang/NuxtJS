<script lang="ts" setup>
import { ShoppingBagIcon } from "lucide-vue-next";
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <div
        class="hover:bg-slate-400/50 cursor-pointer rounded-full bg-slate-200/50 p-2 transition duration-200 hover:scale-105"
      >
        <ShoppingBagIcon class="size-5" />
      </div>
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
    </SheetTrigger>
  </Sheet>
</template>
