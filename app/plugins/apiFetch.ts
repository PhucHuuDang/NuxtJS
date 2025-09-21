export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  // Custom wrapper
  function useApiFetch<T>(url: string, options: any = {}) {
    const accessToken = useCookie<string | null>("accessToken");
    const refreshToken = useCookie<string | null>("refreshToken");

    return useFetch<T>(url, {
      baseURL,
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {}),
        ...options.headers,
      },

      onRequest({ request, options, error }) {
        if (accessToken.value) {
          options.headers.set("Authorization", `Bearer ${accessToken.value}`); // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
        }
      },

      async onResponseError({ response, request }) {
        // if token expired → call refresh

        if (response.status === 401 && refreshToken.value) {
          try {
            const refreshed = await $fetch<{
              accessToken: string;
              refreshToken: string;
            }>(`${baseURL}/auth/refresh`, {
              method: "POST",
              body: {
                refreshToken: refreshToken.value,
                expiresInMins: 120,
              },
            });

            // update token
            accessToken.value = refreshed.accessToken;
            refreshToken.value = refreshed.refreshToken;

            // call request again with new token
            return await $fetch<T>(request, {
              baseURL,
              headers: {
                Authorization: `Bearer ${refreshed.accessToken}`,
              },
            });
          } catch (err) {
            accessToken.value = null;
            refreshToken.value = null;
            navigateTo("/login");
          }
        }
      },
      ...options,
    });
  }

  return {
    provide: {
      apiFetch: useApiFetch,
    },
  };
});
