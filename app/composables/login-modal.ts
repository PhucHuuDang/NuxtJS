import { defineStore } from "pinia";
import { currentUser } from "~/axios-actions/auth";
import type { AuthUser } from "~/types/user.type";

export const useLoginModal = defineStore("loginModal", {
  state: () => ({
    auth: null as AuthUser | null,
    isOpen: false,
  }),
  actions: {
    async fetchUser() {
      try {
        const res = await currentUser();
        this.auth = res?.user || null;
      } catch (error) {
        this.auth = null;
      }
    },
    onOpen(value: boolean) {
      this.isOpen = value;
    },
    onClose() {
      this.isOpen = false;
    },
  },
});
