import { defineStore } from "pinia";
import { currentUser } from "~/axios-actions/auth";
import type { AuthUser } from "~/types/user.type";

interface LoginModalState {
  auth: AuthUser | null;
  isOpen: boolean;
}

export const useLoginModal = defineStore("loginModal", {
  state: () => ({
    auth: null as AuthUser | null,
    isOpen: false,
  }),
  actions: {
    async fetchUser(): Promise<void> {
      try {
        const res = await currentUser();
        this.auth = res?.user || null;
      } catch (error) {
        this.auth = null;
      }
    },
    onOpen(value: boolean): void {
      this.isOpen = value;
    },
    onClose(): void {
      this.isOpen = false;
    },
  },
});
