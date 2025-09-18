<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { AutoForm } from "../ui/auto-form";
import InputFormControl from "../form-control/InputFormControl.vue";
import { UserIcon } from "lucide-vue-next";
import axios from "axios";
import { useCookies } from "@vueuse/integrations/useCookies";
import { toast } from "vue-sonner";
import type { AuthUser } from "~/types/user.type";

const cookies = useCookies(["auth"]);

const isOpen = ref<boolean>(false);

const isPending = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
  })
);

const handleOpenChange = (open: boolean) => {
  isOpen.value = open;
};

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  console.log({ values });
  isPending.value = true;
  try {
    const response = await axios.post(`${useBaseUrl()}/auth/login`, values);
    if (response.status === 200) {
      console.log({ response });

      const data = response.data as AuthUser;

      cookies.set(
        "auth",
        {
          ...data,
        },
        {
          maxAge: 60 * 60 * 24 * 7,
        }
      );
      isOpen.value = false;
      toast.success("Event has been created");
    }
  } catch (error) {
    console.log({ error });
  } finally {
    isPending.value = false;
  }
});

const getCookie = cookies.get("auth");
console.log({ getCookie });
</script>

<template>
  <Dialog :open="isOpen" @open-change="isOpen = $event">
    <DialogTrigger as-child>
      <div
        class="hover:bg-slate-400/50 cursor-pointer rounded-full bg-slate-200/50 p-2 transition duration-200 hover:scale-105"
        @click="handleOpenChange(true)"
      >
        <UserIcon class="size-5" />
      </div>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Welcome back</DialogTitle>
        <DialogDescription>
          Enter your credentials to login to your account.
        </DialogDescription>
      </DialogHeader>

      <form class="w-full space-y-6" @submit.prevent="onSubmit">
        <InputFormControl
          name="username"
          label="Username"
          placeholder="Enter your Username"
          type="text"
          required
          :disabled="isPending"
        />

        <InputFormControl
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          required
          :disabled="isPending"
        />

        <Button type="submit"> Submit </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
