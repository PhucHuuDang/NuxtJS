<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Component } from "vue";

interface ActionProps {
  label: string;
  onClick: () => void;
}

const props = defineProps<{
  title: string;
  description: string;
  icons?: Component[];
  action?: ActionProps;
  class?: string;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'bg-background border-border hover:border-border/80 text-center',
        'border-2 border-dashed rounded-xl p-14 w-full max-w-[620px]',
        'group hover:bg-muted/50 transition duration-500 hover:duration-200',
        props.class
      )
    "
  >
    <!-- Icons -->
    <div class="flex justify-center isolate">
      <template v-if="props.icons?.length === 3">
        <div
          class="bg-background size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-border group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200"
        >
          <component
            :is="props.icons[0]"
            class="w-6 h-6 text-muted-foreground"
          />
        </div>

        <div
          class="bg-background size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200"
        >
          <component
            :is="props.icons[1]"
            class="w-6 h-6 text-muted-foreground"
          />
        </div>

        <div
          class="bg-background size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-border group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200"
        >
          <component
            :is="props.icons[2]"
            class="w-6 h-6 text-muted-foreground"
          />
        </div>
      </template>

      <template v-else>
        <div
          class="bg-background size-12 grid place-items-center rounded-xl shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200"
        >
          <component
            v-if="props.icons?.[0]"
            :is="props.icons[0]"
            class="w-6 h-6 text-muted-foreground"
          />
        </div>
      </template>
    </div>

    <!-- Title & description -->
    <h2 class="text-foreground font-medium mt-6">{{ props.title }}</h2>
    <p class="text-sm text-muted-foreground mt-1 whitespace-pre-line">
      {{ props.description }}
    </p>

    <!-- Action button -->
    <Button
      v-if="props.action"
      @click="props.action.onClick"
      variant="outline"
      :class="cn('mt-4', 'shadow-sm active:shadow-none')"
    >
      {{ props.action.label }}
    </Button>
  </div>
</template>
