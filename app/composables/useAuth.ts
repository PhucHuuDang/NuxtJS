import { toast } from "vue-sonner";
import { currentUser } from "~/axios-actions/auth";

export const useAuth = () => {
  let accessToken = useCookie<string | null>("accessToken");
  let refreshToken = useCookie<string | null>("refreshToken");

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    // window.location.href = "/";
    // navigateTo("/");

    toast.success("Logged out successfully");
  };

  return {
    logout,
  };
};

export const useIsAuthenticated = async () => {
  const isAuth = ref(false);
  const response = ref(await currentUser());

  watch(
    response,
    (value) => {
      isAuth.value = !!value?.user;
    },
    { immediate: true, deep: true }
  );

  return {
    isAuth,
    response,
  };
};
