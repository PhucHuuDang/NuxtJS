import axios from "axios";
import { currentUser } from "./auth";
import axiosInstance from "./instance";

interface AddToCartPayload {
  productId: number;
  quantity: number;
}

type ResponseT = Promise<
  | {
      message: null;
      error: string;
    }
  | {
      message: string;
      error: null;
    }
  | undefined
>;

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartPagination {
  total: number;
  skip: number;
  limit: number;
}

export const addToCart = async (products: AddToCartPayload[]): ResponseT => {
  const user = await currentUser();

  if (!user?.user) {
    return {
      message: null,
      error: "User not found",
    };
  }
  try {
    const response = await axiosInstance.post("/carts/add", {
      userId: user.user.id,
      products,
    });

    if (response.status === 200) {
      return {
        message: "Product added to cart",
        error: null,
      };
    }
  } catch (error) {
    return {
      message: null,
      error: error as string,
    };
  }
};

export interface CartsResponse extends CartPagination {
  carts: Cart[];
}
export type GetCartByUserResponse =
  | (CartsResponse & { error: null })
  | {
      carts: null;
      total?: number;
      skip?: number;
      limit?: number;
      error: string;
    };

export const getCartByUser = async (): Promise<
  | {
      carts: Cart[] | null;
      error: string | null;
    }
  | undefined
> => {
  const user = await currentUser();

  if (!user?.user) {
    return {
      carts: null,
      error: "User not found",
    };
  }

  console.log("user id: ", user.user.id);

  try {
    const response = await axiosInstance.get<GetCartByUserResponse>(
      `/carts/user/${user.user.id}`
    );

    // const response = await axios.get<GetCartByUserResponse>(
    //   `https://dummyjson.com/carts/user/${user.user.id}`
    // );

    console.log("response: ", response);

    if (response.status === 200 && response.data) {
      return {
        ...response.data,
        error: null,
      };
    }
  } catch (error) {
    return {
      carts: null,
      error: error as string,
    };
  }
};
