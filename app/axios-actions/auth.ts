import axios from "axios";
import type { AuthUser } from "~/types/user.type";
import axiosInstance from "./instance";

type CurrentUserResponse =
  | {
      user: AuthUser;
      error: Error | null;
    }
  | {
      user: null;
      error: Error | null;
    }
  | null
  | undefined;

export const currentUser = async (): Promise<CurrentUserResponse> => {
  const accessToken = useCookie<AuthUser | null>("accessToken");
  const refreshToken = useCookie<AuthUser | null>("refreshToken");

  console.log("auth: ", accessToken.value);

  if (!accessToken.value) {
    return {
      user: null,
      error: new Error("User not found"),
    };
  }

  try {
    const response = await axiosInstance.get(`${useBaseUrl()}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken.value.accessToken}`,
      },
    });

    if (response.status === 200) {
      return {
        user: response.data as AuthUser,
        error: null,
      };
    }
  } catch (error) {
    return {
      user: null,
      error: error as Error,
    };
  }
};
