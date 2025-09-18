<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { UserIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import z from "zod";
import { DialogClose } from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: "",
    password: "",
  },
});

const onSubmit = form.handleSubmit((values) => {
  alert(`Submitted values: ${JSON.stringify(values)}`);
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <div
        class="hover:bg-slate-400/50 cursor-pointer rounded-full bg-slate-200/50 p-2 transition duration-200 hover:scale-105"
      >
        <UserIcon class="size-5" />
      </div>
    </DialogTrigger>
    <DialogContent class="w-full max-w-lg">
      <DialogHeader class="my-4">
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Login to your account to continue.
        </DialogDescription>
      </DialogHeader>

      <!-- ✅ Wrap in Form for context -->
      <Form :form="form">
        <!-- ✅ Prevent default form submit -->
        <form class="w-full space-y-6" @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem v-auto-animate>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <!-- ✅ Correct binding -->
                <Input
                  type="text"
                  placeholder="Enter username"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem v-auto-animate>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter class="w-full flex items-center gap-4">
            <Button type="submit" class="rounded-lg w-20 border-none">
              Submit
            </Button>
            <DialogClose class="p-2 rounded-lg border w-20">
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
</template>
