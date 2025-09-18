<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;

  class?: string;

  label: string;

  description?: string;

  placeholder: string;

  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week";

  disabled?: boolean;

  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Input
          :type="type"
          :placeholder="placeholder"
          v-bind="componentField"
          :disabled="disabled"
          :required="required"
        />
      </FormControl>
      <FormDescription> This is your password. </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
