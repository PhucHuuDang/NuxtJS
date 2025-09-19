import { toast } from "vue-sonner";

export const useAuth = () => {
  let accessToken = useCookie<string | null>("accessToken");
  let refreshToken = useCookie<string | null>("refreshToken");

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    window.location.href = "/";

    toast.success("Logged out successfully");
  };

  return {
    logout,
  };
};
