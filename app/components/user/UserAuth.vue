<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import InputFormControl from "../form-control/InputFormControl.vue";
import {
  CloudIcon,
  CreditCard,
  GithubIcon,
  KeyboardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AuthUser } from "~/types/user.type";
import axiosInstance from "~/axios-actions/instance";
import { currentUser } from "~/axios-actions/auth";
import { reactify } from "@vueuse/core";

const accessToken = useCookie<string | null>("accessToken");
const refreshToken = useCookie<string | null>("refreshToken");

const isOpen = ref<boolean>(false);

const user = ref<{
  user: AuthUser | null;
  error: Error | null;
}>();

const { logout } = useAuth();

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
  // console.log({ values });
  isPending.value = true;
  try {
    const response = await axiosInstance.post(`${useBaseUrl()}/auth/login`, {
      ...values,
      expiresInMins: 1,
    });
    if (response.status === 200) {
      // const data = response.data as AuthUser;

      // ✅ set cookie SSR-friendly
      // userCookie.value = data;
      accessToken.value = response.data.accessToken;
      refreshToken.value = response.data.refreshToken;
      isOpen.value = false;
      toast.success("Event has been created");
    }
  } catch (error) {
    console.log({ error });
  } finally {
    isPending.value = false;
  }
});

const handleLogout = () => {
  logout();
};

watch(
  () => currentUser(),
  async (newAuth) => {
    const data = await newAuth;
    user.value = data as {
      user: AuthUser | null;
      error: Error | null;
    };
  },
  { immediate: true }
);
</script>

<template>
  <ClientOnly>
    <Dialog v-if="!user?.user" :open="isOpen" @open-change="isOpen = $event">
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

          <div class="flex items-center justify-end gap-2">
            <Button type="submit"> Submit </Button>

            <Button type="button" @click="handleOpenChange(false)">
              Close
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- <ClientOnly> -->
    <!-- <template v-if="user"> -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <div
          class="hover:bg-slate-400/50 cursor-pointer rounded-full bg-slate-200/50 p-2 transition duration-200 hover:scale-105"
          v-show="user?.user"
        >
          <ClientOnly>
            <NuxtImg
              :src="user?.user?.image || '/avatar.jpg'"
              v-show="user?.user"
              alt="user image"
              class="w-5 h-5 rounded-full"
            />
          </ClientOnly>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon class="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard class="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon class="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyboardIcon class="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UsersIcon class="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlusIcon class="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <MailIcon class="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquareIcon class="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircleIcon class="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <PlusIcon class="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <GithubIcon class="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoyIcon class="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <CloudIcon class="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="handleLogout">
          <LogOutIcon class="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <!-- </template> -->
    <!-- </ClientOnly> -->
  </ClientOnly>
</template>
