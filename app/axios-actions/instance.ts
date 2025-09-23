import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "~/types/user.type";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

function isTokenExpired(token: string, leeway = 10000): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now() + leeway;
  } catch (err) {
    return true;
  }
}

const axiosInstance = axios.create({
  // baseURL: process.env.NUXT_PUBLIC_API_BASE,
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

async function refreshTokens(refreshToken: string | null) {
  if (!refreshToken) throw new Error("No refresh token");

  const baseUrl = useBaseUrl();
  const response = (await axios.post(`${baseUrl}/auth/refresh`, {
    refreshToken,
    expiresInMins: 120,
  })) as AxiosResponse<RefreshResponse>;

  return response.data;
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    let accessToken = useCookie<string | null>("accessToken");
    let refreshToken = useCookie<string | null>("refreshToken");

    // console.log({ config });

    console.log("BaseURL: ", process.env.NUXT_PUBLIC_API_BASE);

    if (!accessToken.value || !refreshToken.value) {
      return config;
    }

    if (!isTokenExpired(accessToken.value)) {
      config.headers.Authorization = `Bearer ${accessToken.value}`;
      return config;
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(config);
        });
      });
    }

    isRefreshing = true;

    try {
      const data = await refreshTokens(refreshToken.value);
      // console.log("refreshing...");
      // console.log("refresh token success");
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;

      config.headers.Authorization = `Bearer ${accessToken.value}`;

      refreshQueue.forEach((cb) => cb(accessToken.value));
      refreshQueue = [];
    } catch (err) {
      accessToken.value = null;
      refreshToken.value = null;
      refreshQueue.forEach((cb) => cb(null));
      window.location.href = "/login";

      // if (process.client) {
      //   window.location.href = "/login";
      //   // hoặc: navigateTo("/login")
      // } else {
      //   throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
      // }
      // navigateTo("/login");
    } finally {
      isRefreshing = false;
    }

    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    let accessToken = useCookie<string | null>("accessToken");
    let refreshToken = useCookie<string | null>("refreshToken");

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      refreshToken.value
    ) {
      originalRequest._retry = true;

      try {
        const data = await refreshTokens(refreshToken.value);

        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;

        originalRequest.headers.Authorization = `Bearer ${accessToken.value}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        accessToken.value = null;
        refreshToken.value = null;
        window.location.href = "/login";

        // if (process.client) {
        //   window.location.href = "/login";
        //   // hoặc: navigateTo("/login")
        // } else {
        //   throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
        // }

        // navigateTo("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
