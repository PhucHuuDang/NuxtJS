export function useBaseUrl() {
  const config = useRuntimeConfig();
  return config.public.apiBase;
}
