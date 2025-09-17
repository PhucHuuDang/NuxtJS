import axios from "axios";
import { useBaseUrl } from "~/composables/url";

export const getProducts = async <T>() => {
  const url = useBaseUrl();
  console.log({ url });
  try {
    const response = await axios.get<T>(`${url}/products`);

    console.log({ response });

    if (response.status === 200) {
      return {
        data: response.data as T,
        error: null as Error | null,
      };
    }

    return {
      data: null as T | null,
      error: new Error("Unexpected response status"),
    };
  } catch (error) {
    return {
      data: null as T | null,
      error: error as Error,
    };
  }
};

export const getProductById = async (id: string) => {
  const url = useBaseUrl();

  const response = await axios.get(`${url}/products/${id}`);

  try {
    if (response.status === 200) {
      return {
        product: response.data,
        error: null,
      };
    }
  } catch (error) {
    return {
      product: null,
      error,
    };
  }
};
